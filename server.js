import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conectarBanco from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/PetRoutes.js";
import { login, register } from "./controllers/authController.js";

dotenv.config();

const app = express();

// Configuração robusta de CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Conexão com o Banco de Dados MongoDB
conectarBanco();

// Rotas de Autenticação e Registro (mapeamento universal sem erros 404)
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/usuarios", userRoutes);
app.use("/api/usuarios", userRoutes);

// Atalhos diretos para endpoints globais de cadastro e login
app.post("/register", register);
app.post("/api/register", register);
app.post("/cadastrar", register);
app.post("/api/cadastrar", register);
app.post("/cadastro", register);
app.post("/api/cadastro", register);
app.post("/login", login);
app.post("/api/login", login);

// Rotas de Pets (importando PetRoutes.js de forma 100% case-sensitive para o Linux/Render)
app.use("/pets", petRoutes);
app.use("/api/pets", petRoutes);

// Endpoint de teste e saúde
app.get("/", (req, res) => {
    res.json({ mensagem: "API PawConnect funcionando 🚀", status: "online", port: process.env.PORT || 5000 });
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

// Middleware 404 com log detalhado para o Render
app.use((req, res) => {
    console.warn(`[404 NOT FOUND] ${req.method} ${req.originalUrl}`);
    res.status(404).json({ mensagem: `Rota '${req.originalUrl}' não encontrada no servidor PawConnect.` });
});

// Middleware de tratamento global de erros
app.use((err, req, res, next) => {
    console.error("Erro interno no servidor:", err);
    res.status(500).json({ mensagem: "Erro interno no servidor.", erro: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 Servidor Back-End PawConnect ativo!`);
    console.log(`📡 Rodando na porta: ${PORT}`);
    console.log(`================================================`);
});