import express from "express";
import {
  cadastrarUsuario,
  loginUsuario,
  listarUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/", listarUsuarios);
router.get("/:id", obterUsuarioPorId);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;