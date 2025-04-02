import express from 'express';
import {
  login,
  refreshToken,
  validateToken,
} from '../controllers/authController.js';
import { addUser } from '../controllers/userController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

//Pour pouvoir register avec un avatar, il fadra passer par le form-data et non par le raw-JSON
router.post('/register', upload.single('avatar'), addUser);
router.post('/login', login);
router.post('/refresh_token', refreshToken);
router.get('/validate_token', validateToken);

export default router;
