import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "pawconnect_jwt_secret_key_2026";

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, nome, email, password, senha } = req.body;
    const userName = name || nome;
    const userPassword = password || senha;

    if (!userName || !email || !userPassword) {
      return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ mensagem: "Este e-mail já está cadastrado." });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create user in MongoDB
    const user = await User.create({
      nome: userName.trim(),
      email: cleanEmail,
      senha: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
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
    console.error("Erro no cadastro de usuário:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário", erro: error.message });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password, senha } = req.body;
    const userPassword = password || senha;

    if (!email || !userPassword) {
      return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user in MongoDB
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." });
    }

    // Compare password with bcrypt or plaintext (backward compatibility)
    let isPasswordValid = false;
    if (user.senha.startsWith("$2a$") || user.senha.startsWith("$2b$") || user.senha.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(userPassword, user.senha);
    } else {
      isPasswordValid = (user.senha === userPassword);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
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
    console.error("Erro no login de usuário:", error);
    return res.status(500).json({ mensagem: "Erro ao realizar login", erro: error.message });
  }
};
