import User from "../models/User.js";

export const cadastrarUsuario = async (req,res)=>{

    try{

        const usuario = await User.create(req.body);

        res.status(201).json(usuario);

    }catch(erro){

        res.status(500).json(erro);

    }

}