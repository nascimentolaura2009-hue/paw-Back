import User from "../models/User.js";

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password, senha } = req.body;
    const pwd = password || senha;

    if (!email || !pwd) {
      return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.senha !== pwd) {
      return res.status(401).json({ mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token: `pawconnect-token-${user._id}-${Date.now()}`,
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
    return res.status(500).json({ mensagem: "Erro ao realizar login", erro: error.message });
  }
};

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, nome, email, password, senha } = req.body;
    const userName = name || nome;
    const userPassword = password || senha;

    if (!userName || !email || !userPassword) {
      return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ mensagem: "Este e-mail já está cadastrado." });
    }

    const user = await User.create({
      nome: userName,
      email: email.toLowerCase().trim(),
      senha: userPassword,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      user: {
        id: user._id,
        name: user.nome,
        email: user.email,
      }
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário", erro: error.message });
  }
};
