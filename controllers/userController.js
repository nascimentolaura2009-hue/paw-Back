import User from "../models/User.js";
import { register, login } from "./authController.js";

// Aliases para manter 100% de compatibilidade com rotas legadas
export const cadastrarUsuario = register;
export const loginUsuario = login;

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