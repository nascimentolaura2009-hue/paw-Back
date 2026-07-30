import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import conectarBanco from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "pawconnect_jwt_secret_key_2026";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /auth/register
export const register = async (req, res) => {
  const startTime = Date.now();
  try {
    const { name, nome, email, password, senha } = req.body;
    const userName = (name || nome || "").trim();
    const userEmail = (email || "").toLowerCase().trim();
    const userPassword = password || senha;

    console.log(`📥 [AUTH REGISTER]: Nova requisição de cadastro recebida para: ${userEmail || "E-mail não fornecido"}`);

    // 1. Validações Explicitas de Entrada
    if (!userName) {
      return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }

    if (!userEmail || !EMAIL_REGEX.test(userEmail)) {
      return res.status(400).json({ mensagem: "Por favor, forneça um endereço de e-mail válido." });
    }

    if (!userPassword || userPassword.length < 6) {
      return res.status(400).json({ mensagem: "A senha é obrigatória e deve possuir no mínimo 6 caracteres." });
    }

    // 2. Garantir conexão ativa com o MongoDB (tolerar Cold Start)
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [AUTH REGISTER]: Conexão DB pendente. Aguardando estabelecimento...");
      await conectarBanco();
    }

    // 3. Verificar existência de usuário
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      console.warn(`⚠️ [AUTH REGISTER]: Tentativa de cadastro com e-mail duplicado: ${userEmail}`);
      return res.status(409).json({ mensagem: "Este e-mail já está cadastrado em nossa plataforma." });
    }

    // 4. Hash da senha
    console.log("🔐 [AUTH REGISTER]: Gerando hash seguro de senha com bcrypt...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // 5. Persistência no MongoDB
    console.log("💾 [AUTH REGISTER]: Salvando novo usuário no MongoDB...");
    const user = await User.create({
      nome: userName,
      email: userEmail,
      senha: hashedPassword,
    });

    console.log(`✅ [AUTH REGISTER]: Usuário criado com sucesso no banco! ID: ${user._id}`);

    // 6. Geração do Token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const duration = Date.now() - startTime;
    console.log(`⏱️ [AUTH REGISTER]: Processo concluído em ${duration}ms`);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      token,
      usuario: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
      user: {
        id: user._id,
        name: user.nome,
        email: user.email,
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`💥 [AUTH REGISTER CRITICAL ERROR] (${duration}ms):`, error);

    // Tratamento específico de erro de duplicidade do MongoDB (E11000)
    if (error.code === 11000) {
      return res.status(409).json({ mensagem: "Este e-mail já está cadastrado." });
    }

    // Tratar erros de validação do Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensagem: "Dados inválidos.", erros: messages });
    }

    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário no banco de dados.",
      erro: error.message,
    });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  const startTime = Date.now();
  try {
    const { email, password, senha } = req.body;
    const userEmail = (email || "").toLowerCase().trim();
    const userPassword = password || senha;

    console.log(`📥 [AUTH LOGIN]: Nova tentativa de login para: ${userEmail}`);

    if (!userEmail || !userPassword) {
      return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    // Garantir conexão com MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [AUTH LOGIN]: Conexão DB pendente. Aguardando conexão...");
      await conectarBanco();
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.warn(`⚠️ [AUTH LOGIN]: Usuário não encontrado para e-mail: ${userEmail}`);
      return res.status(401).json({ mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." });
    }

    // Comparar senha
    let isPasswordValid = false;
    if (user.senha.startsWith("$2a$") || user.senha.startsWith("$2b$") || user.senha.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(userPassword, user.senha);
    } else {
      isPasswordValid = (user.senha === userPassword);
    }

    if (!isPasswordValid) {
      console.warn(`⚠️ [AUTH LOGIN]: Senha incorreta para o e-mail: ${userEmail}`);
      return res.status(401).json({ mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." });
    }

    // Gerar Token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ [AUTH LOGIN]: Login realizado com sucesso em ${duration}ms! ID: ${user._id}`);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
      user: {
        id: user._id,
        name: user.nome,
        email: user.email,
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`💥 [AUTH LOGIN ERROR] (${duration}ms):`, error);
    return res.status(500).json({ mensagem: "Erro ao realizar login.", erro: error.message });
  }
};
