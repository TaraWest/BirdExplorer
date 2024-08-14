import { Router } from "express";
import birdController from "../controllers/birdControllers.js";

const router = Router();

router.get("/", birdController.getAll);
router.get("/:id", birdController.getOne);

export default router;
