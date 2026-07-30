import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// Rotas de login
router.post("/login", login);
router.post("/login/", login);

// Rotas de cadastro/registro (mapeamento universal)
router.post("/register", register);
router.post("/register/", register);
router.post("/cadastrar", register);
router.post("/cadastrar/", register);
router.post("/cadastro", register);
router.post("/cadastro/", register);
router.post("/signup", register);
router.post("/signup/", register);
router.post("/", register);

export default router;
