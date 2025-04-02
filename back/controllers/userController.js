import User from '../models/user.js';
import { hashPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Crée un compte utilisateur et génère des tokens d'authentification.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Motdepasse123"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Fichier image pour l'avatar"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Erreur dans la création de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error in addUser: username already taken"
 */
export const addUser = async (req, res) => {
  try {
    req.body.password = hashPassword(req.body.password);
    if (req.file) {
      req.body.avatarUrl = `/uploads/${req.file.filename}`;
    }
    const user = new User(req.body);
    await user.save();

    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error in addUser:', error);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Récupère le profil de l'utilisateur authentifié
 *     security:
 *       - JWT: []
 *     description: Nécessite un token d'accès valide.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "642bea5fd26df83085c5c99b"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 avatarUrl:
 *                   type: string
 *                   example: "/uploads/avatar.png"
 *       401:
 *         description: Accès non autorisé (token manquant ou invalide).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied. Invalid token."
 */
export const getMyProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur authentifié
 *     description: Permet de modifier des informations du profil. Nécessite un token d'accès valide.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe_updated"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Nouveau fichier image pour l'avatar"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "642bea5fd26df83085c5c99b"
 *                 username:
 *                   type: string
 *                   example: "john_doe_updated"
 *                 avatarUrl:
 *                   type: string
 *                   example: "/uploads/avatar.png"
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Erreur serveur lors de la mise à jour.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */
export const updateMyProfile = async (req, res) => {
  try {
    if (req.file) {
      req.body.avatarUrl = `/uploads/${req.file.filename}`;
    }
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
