import express from "express";
import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

const router = express.Router();

router.post("/", createPet);
router.get("/", getAllPets);
router.get("/:id", getPetById);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;