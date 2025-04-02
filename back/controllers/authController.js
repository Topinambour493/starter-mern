import User from '../models/user.js';
import { checkPassword } from '../utils/bcrypt.js';
import { sleep } from '../utils/sleep.js';
import { generateToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
const { verify } = jwt;

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifie un utilisateur et génère des tokens
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne accessToken et refreshToken.
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
 *         description: Erreur d'authentification (mot de passe incorrect ou utilisateur introuvable).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Incorrect password"
 *       500:
 *         description: Erreur serveur lors de l'authentification.
 */
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('+password');
    if (user) {
      const isPasswordValid = checkPassword(req.body.password, user.password);
      if (isPasswordValid) {
        const accessToken = generateToken(user.id, 'access');
        const refreshToken = generateToken(user.id, 'refresh');

        return res.status(200).json({ accessToken, refreshToken });
      } else {
        await sleep(1000);
        return res.status(400).json({ error: 'Incorrect password' });
      }
    } else {
      return res.status(400).json({ error: 'username not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/refresh_token:
 *   post:
 *     summary: Renouvelle le token d'accès à partir d'un refresh token valide
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Nouveau token d'accès généré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Erreur dans la validation du refresh token ou token expiré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This token is not a refresh token"
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = verify(refreshToken, process.env.JWT_SECRET_KEY || '');
    if (!decoded || decoded.scope !== 'refresh') {
      return res.status(400).json({ error: 'This token is not a refresh token' });
    }
    const expirationTime = parseInt(decoded.time) + parseInt(process.env.JWT_REFRESH_EXPIRATION || '0');
    if (expirationTime < Date.now()) {
      const accessToken = generateToken(decoded.userId, 'access');
      return res.status(200).json({ accessToken });
    }
    return res.status(400).json({ error: 'Refresh token expired' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/auth/validate_token:
 *   get:
 *     summary: Valide un token d'accès
 *     security:
 *       - JWT: []
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Token valide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token successfully verified"
 *       401:
 *         description: Accès refusé, token manquant ou invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access Denied: No token provided"
 */
export const validateToken = async (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Access Denied: No token provided' });
    }
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET_KEY || '');
    if (!decoded || decoded.scope !== 'access') {
      return res.status(401).json({ error: 'This token is not an access token' });
    }
    const expirationTime = parseInt(decoded.time) + parseInt(process.env.JWT_EXPIRATION || '0');
    if (expirationTime < Date.now()) {
      return res.status(200).json({ message: 'Token successfully verified' });
    }
    return res.status(401).json({ error: 'Access denied: Token expired' });
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(401).json({ error: error.message });
  }
};
