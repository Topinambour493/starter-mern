import {
  getMyProfile,
  updateMyProfile,
} from '../controllers/userController.js';
import { isConnected } from '../middlewares/auth.js';
import express from 'express';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', isConnected, getMyProfile);
router.put('/', isConnected, upload.single('avatar'), updateMyProfile);
export default router;
