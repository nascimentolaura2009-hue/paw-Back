import Pet from "../models/Pet.js";
import mongoose from "mongoose";
import conectarBanco from "../config/db.js";

// Create a new pet
export const createPet = async (req, res) => {
  try {
    const {
      name, nome,
      species, especie, tipo,
      breed, raca,
      age, idade,
      gender, genero,
      size, porte,
      description, descricao,
      image, imagem, imageUrl, foto, photo, url, fotoUrl,
      status
    } = req.body;

    const petName = (name || nome || "").trim();
    const petSpecies = (species || especie || tipo || "").trim();
    const rawImage = (image || imagem || imageUrl || foto || photo || url || fotoUrl || "").trim();

    console.log(`📥 [PET CREATE]: Tentativa de cadastro: "${petName}" (${petSpecies}) | Imagem: ${rawImage || "sem imagem"}`);

    if (!petName || !petSpecies) {
      return res.status(400).json({
        message: "Pet name and species are required.",
        mensagem: "Nome e espécie/tipo são obrigatórios."
      });
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [PET CREATE]: Aguardando conexão com banco de dados...");
      await conectarBanco();
    }

    const pet = await Pet.create({
      name: petName,
      species: petSpecies,
      breed: (breed || raca || "Misto / Vira-lata").trim(),
      age: age !== undefined && age !== "" ? Number(age) : (idade !== undefined && idade !== "" ? Number(idade) : 0),
      gender: gender || genero || "Macho",
      size: size || porte || "Médio",
      description: (description || descricao || "").trim(),
      image: rawImage,
      status: status || "available",
    });

    console.log(`✅ [PET CREATED]: Pet "${pet.name}" salvo no MongoDB com a imagem: "${pet.image}" (ID: ${pet._id})`);

    return res.status(201).json(pet);
  } catch (error) {
    console.error("💥 [PET CREATE ERROR]:", error);
    return res.status(500).json({
      message: "Error creating pet",
      mensagem: "Erro ao cadastrar pet",
      error: error.message
    });
  }
};

// Get all pets with optional filtering
export const getAllPets = async (req, res) => {
  try {
    const { status, species, especie, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    const querySpecies = species || especie;
    if (querySpecies) filter.species = new RegExp(querySpecies, "i");
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { species: new RegExp(search, "i") },
        { breed: new RegExp(search, "i") }
      ];
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ [PET GET ALL]: Aguardando conexão com banco de dados...");
      await conectarBanco();
    }

    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    console.log(`🐾 [PET GET ALL]: ${pets.length} pet(s) encontrados no MongoDB.`);

    return res.status(200).json(pets);
  } catch (error) {
    console.error("💥 [PET GET ALL ERROR]:", error);
    return res.status(500).json({
      message: "Error fetching pets",
      mensagem: "Erro ao listar pets",
      error: error.message
    });
  }
};

// Get a pet by ID
export const getPetById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await conectarBanco();
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({
        message: "Pet not found.",
        mensagem: "Pet não encontrado."
      });
    }
    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching pet",
      mensagem: "Erro ao buscar pet",
      error: error.message
    });
  }
};

// Update a pet by ID
export const updatePet = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await conectarBanco();
    }

    const updateData = { ...req.body };
    if (updateData.nome && !updateData.name) updateData.name = updateData.nome;
    if (updateData.especie && !updateData.species) updateData.species = updateData.especie;
    if (updateData.tipo && !updateData.species) updateData.species = updateData.tipo;
    if (updateData.idade !== undefined && updateData.age === undefined) updateData.age = Number(updateData.idade);
    if (updateData.descricao && !updateData.description) updateData.description = updateData.descricao;
    
    // Normalizar campo de imagem nas atualizações
    const newImage = updateData.image || updateData.imagem || updateData.imageUrl || updateData.foto;
    if (newImage) updateData.image = newImage.trim();

    const pet = await Pet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found.",
        mensagem: "Pet não encontrado."
      });
    }

    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating pet",
      mensagem: "Erro ao atualizar pet",
      error: error.message
    });
  }
};

// Delete a pet by ID
export const deletePet = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await conectarBanco();
    }

    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({
        message: "Pet not found.",
        mensagem: "Pet não encontrado."
      });
    }
    return res.status(200).json({
      message: "Pet removed successfully.",
      mensagem: "Pet removido com sucesso."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting pet",
      mensagem: "Erro ao deletar pet",
      error: error.message
    });
  }
};

// Portuguese exports alias for backward compatibility
export const cadastrarPet = createPet;
export const listarPets = getAllPets;
export const obterPetPorId = getPetById;
export const atualizarPet = updatePet;
export const deletarPet = deletePet;