import express from 'express';
import {getImage} from "../controllers/imageController.js";

const router = express.Router();

// Route pour récupérer les images
router.get('/uploads/:filename', getImage)

export default router;
