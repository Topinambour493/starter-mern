import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import imagesRoutes from './routes/imagesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);
app.use('/api', imagesRoutes);

// Route pour accéder à la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.get('/', (req, res) => {
  res.send('Bienvenue sur mon API ! Consultez /api-docs pour la documentation.');
});


mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connecté avec succès !'))
  .catch((error) => console.log('Erreur de connexion à MongoDB:', error));

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      'Server is Successfully Running, and App is listening on port ' + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});
