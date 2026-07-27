import mongoose from "mongoose";

const conectarBanco = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado");
    } catch (erro) {
        console.log(erro);
    }
};

export default conectarBanco;