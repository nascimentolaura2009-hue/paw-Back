import Pet from "../models/Pet.js";

export const cadastrarPet = async(req,res)=>{

    try{

        const pet = await Pet.create(req.body);

        res.status(201).json(pet);

    }catch(erro){

        res.status(500).json(erro);

    }

}

export const listarPets = async(req,res)=>{

    const pets = await Pet.find();

    res.json(pets);

}