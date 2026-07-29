import User from "../models/User.js";

// Cadastrar novo usuário
export const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Este e-mail já está cadastrado." });
    }

    const usuario = await User.create({ nome, email, senha });
    return res.status(201).json(usuario);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário", erro: erro.message });
  }
};

// Login de usuário
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    const usuario = await User.findOne({ email });
    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao realizar login", erro: erro.message });
  }
};

// Listar todos os usuários
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-senha");
    return res.status(200).json(usuarios);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao listar usuários", erro: erro.message });
  }
};

// Obter usuário por ID
export const obterUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-senha");
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao buscar usuário", erro: erro.message });
  }
};

// Atualizar usuário por ID
export const atualizarUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-senha");

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    return res.status(200).json(usuario);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao atualizar usuário", erro: erro.message });
  }
};

// Deletar usuário por ID
export const deletarUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    return res.status(200).json({ mensagem: "Usuário removido com sucesso." });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao deletar usuário", erro: erro.message });
  }
};