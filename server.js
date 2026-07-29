import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conectarBanco from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import PetRoutes from "./routes/PetRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

app.use("/usuarios", userRoutes);
app.use("/pets", PetRoutes);

app.get("/", (req, res) => {
    res.json({ mensagem: "API PawConnect funcionando 🚀" });
});

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ mensagem: "Rota não encontrada." });
});

// Middleware de tratamento global de erros
app.use((err, req, res, next) => {
    console.error("Erro interno:", err);
    res.status(500).json({ mensagem: "Erro interno no servidor.", erro: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});