import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

// Middleware de Log Estruturado de Requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`📡 [HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Middleware de verificação de prontidão do banco (Garante tolerância ao Cold Start)
app.use(async (req, res, next) => {
  if (req.path === "/" || req.path === "/health" || req.path === "/api/health") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    console.warn(`⏳ [DB WAIT] Requisição ${req.method} ${req.path} aguardando banco de dados...`);
    try {
      await conectarBanco();
    } catch (e) {
      console.error("🔴 [DB WAIT ERROR]:", e.message);
    }
  }
  next();
});

// Conexão inicial com o Banco de Dados
conectarBanco();

// Rotas de Autenticação e Registro
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/usuarios", userRoutes);
app.use("/api/usuarios", userRoutes);

// Atalhos diretos para cadastro e login
app.post("/register", register);
app.post("/api/register", register);
app.post("/cadastrar", register);
app.post("/api/cadastrar", register);
app.post("/cadastro", register);
app.post("/api/cadastro", register);
app.post("/login", login);
app.post("/api/login", login);

// Rotas de Pets
app.use("/pets", petRoutes);
app.use("/api/pets", petRoutes);

// Endpoints de Saúde e Status do Banco
app.get("/", (req, res) => {
    res.json({
      mensagem: "API PawConnect funcionando 🚀",
      status: "online",
      dbStatus: mongoose.connection.readyState === 1 ? "connected" : "connecting",
      port: process.env.PORT || 5000
    });
});

app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      dbReadyState: mongoose.connection.readyState,
      timestamp: new Date()
    });
});

app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      dbReadyState: mongoose.connection.readyState,
      timestamp: new Date()
    });
});

// Middleware 404
app.use((req, res) => {
    console.warn(`[404 NOT FOUND] ${req.method} ${req.originalUrl}`);
    res.status(404).json({ mensagem: `Rota '${req.originalUrl}' não encontrada no servidor PawConnect.` });
});

// Middleware de tratamento global de erros
app.use((err, req, res, next) => {
    console.error("💥 [GLOBAL SERVER ERROR]:", err);
    res.status(500).json({ mensagem: "Erro interno no servidor.", erro: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 Servidor Back-End PawConnect ativo!`);
    console.log(`📡 Rodando na porta: ${PORT}`);
    console.log(`================================================`);
});