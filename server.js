import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conectarBanco from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

// Routes
app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/pets", petRoutes);
app.use("/api/pets", petRoutes);

app.get("/", (req, res) => {
    res.json({ mensagem: "API PawConnect funcionando 🚀", status: "online" });
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