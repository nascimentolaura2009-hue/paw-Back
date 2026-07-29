import express from "express";
import {
  cadastrarPet,
  listarPets,
  obterPetPorId,
  atualizarPet,
  deletarPet,
} from "../controllers/petController.js";

const router = express.Router();

router.post("/", cadastrarPet);
router.get("/", listarPets);
router.get("/:id", obterPetPorId);
router.put("/:id", atualizarPet);
router.delete("/:id", deletarPet);

export default router;