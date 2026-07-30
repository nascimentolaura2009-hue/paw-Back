import mongoose from "mongoose";

const conectarBanco = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pawconnect";
        await mongoose.connect(mongoURI);
        console.log("MongoDB conectado com sucesso! 🚀");
    } catch (erro) {
        console.error("Erro ao conectar ao MongoDB:", erro.message);
    }
};

export default conectarBanco;