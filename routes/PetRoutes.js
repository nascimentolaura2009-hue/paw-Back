import express from "express";

import { cadastrarPet,listarPets } from "../controllers/petController.js";

const router = express.Router();

router.post("/", cadastrarPet);

router.get("/", listarPets);

export default router;