import Pet from "../models/Pet.js";

// Cadastrar pet
export const cadastrarPet = async (req, res) => {
  try {
    const { nome, especie, tipo, idade, descricao, imagem, status } = req.body;

    if (!nome || (!especie && !tipo)) {
      return res.status(400).json({ mensagem: "Nome e espécie/tipo são obrigatórios." });
    }

    const pet = await Pet.create({
      nome,
      especie: especie || tipo,
      tipo: tipo || especie,
      idade: idade ? Number(idade) : undefined,
      descricao,
      imagem,
      status,
    });

    return res.status(201).json(pet);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao cadastrar pet", erro: erro.message });
  }
};

// Listar todos os pets (com filtro opcional por status ou espécie)
export const listarPets = async (req, res) => {
  try {
    const { status, especie } = req.query;
    const filtro = {};

    if (status) filtro.status = status;
    if (especie) filtro.especie = new RegExp(especie, "i");

    const pets = await Pet.find(filtro);
    return res.status(200).json(pets);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao listar pets", erro: erro.message });
  }
};

// Obter pet por ID
export const obterPetPorId = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ mensagem: "Pet não encontrado." });
    }
    return res.status(200).json(pet);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao buscar pet", erro: erro.message });
  }
};

// Atualizar pet por ID
export const atualizarPet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({ mensagem: "Pet não encontrado." });
    }

    return res.status(200).json(pet);
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao atualizar pet", erro: erro.message });
  }
};

// Deletar pet por ID
export const deletarPet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ mensagem: "Pet não encontrado." });
    }
    return res.status(200).json({ mensagem: "Pet removido com sucesso." });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao deletar pet", erro: erro.message });
  }
};