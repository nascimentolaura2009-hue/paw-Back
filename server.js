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
    res.send("API PawConnect funcionando 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});