import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({

    nome:{
        type:String,
        required:true
    },

    especie:{
        type:String,
        required:true
    },

    idade:Number,

    descricao:String,

    imagem:String

});

export default mongoose.model("Pet",PetSchema);