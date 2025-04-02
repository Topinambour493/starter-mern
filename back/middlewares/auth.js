import pkg from 'jsonwebtoken';
const { verify } = pkg;

import User from '../models/user.js';

export const isConnected = async (req, res, next) => {
  // vérifie si l'utilisateur est connecté, si c'est le cas, l'user est ajouté au req sinon, la requete est bloqué
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res
        .status(401)
        .send({ error: 'Access Denied: No token provided' });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided!' });
    }

    const decoded = verify(token, process.env.JWT_SECRET_KEY || '');
    if (!decoded || decoded.scope !== 'access') {
      return res
        .status(401)
        .json({ error: 'This token is not an access token' });
    }

    const expirationTime =
      parseInt(decoded.time) +
      parseInt(process.env.JWT_REFRESH_EXPIRATION || '0');
    if (expirationTime < Date.now()) {
      req.user = await User.findById(decoded.userId); // Ajout de l'utilisateur à l'objet `req`
      if (!req.user) {
        return res.status(400).json({ message: 'Invalid profile' });
      }
      next(); // Passe au middleware suivant ou à la route
    } else {
      return res.status(401).send({ error: 'Access denied: Token expired' });
    }
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).send({ error: error.message });
  }
};
