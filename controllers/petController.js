import Pet from "../models/Pet.js";

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
      image, imagem, imageUrl,
      status
    } = req.body;

    const petName = name || nome;
    const petSpecies = species || especie || tipo;

    if (!petName || !petSpecies) {
      return res.status(400).json({
        message: "Pet name and species are required.",
        mensagem: "Nome e espécie/tipo são obrigatórios."
      });
    }

    const pet = await Pet.create({
      name: petName,
      species: petSpecies,
      breed: breed || raca || "Misto / Vira-lata",
      age: age !== undefined ? Number(age) : (idade !== undefined ? Number(idade) : 0),
      gender: gender || genero || "Male",
      size: size || porte || "Medium",
      description: description || descricao || "",
      image: image || imagem || imageUrl || "",
      status: status || "available",
    });

    return res.status(201).json(pet);
  } catch (error) {
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

    const pets = await Pet.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(pets);
  } catch (error) {
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
    const updateData = { ...req.body };
    if (updateData.nome && !updateData.name) updateData.name = updateData.nome;
    if (updateData.especie && !updateData.species) updateData.species = updateData.especie;
    if (updateData.tipo && !updateData.species) updateData.species = updateData.tipo;
    if (updateData.idade !== undefined && updateData.age === undefined) updateData.age = Number(updateData.idade);
    if (updateData.descricao && !updateData.description) updateData.description = updateData.descricao;
    if (updateData.imagem && !updateData.image) updateData.image = updateData.imagem;

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