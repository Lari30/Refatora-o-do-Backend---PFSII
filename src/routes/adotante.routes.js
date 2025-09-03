import { Router } from "express";
import { postAdotante, getAdotanteWithAnimais } from "../controllers/adotante.controller.js";

const router = Router();
router.post("/adotantes", postAdotante);
router.get("/adotantes/:id", getAdotanteWithAnimais);
export default router;
