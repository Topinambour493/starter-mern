import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from "dotenv";

dotenv.config();

// Options de configuration pour swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0', // Version de l'OpenAPI
    info: {
      title: 'API de mon projet', // Titre de l'API
      version: '1.0.0', // Version
      description: 'Documentation de l\'API pour mon projet Node.js',
    },
    servers: [
      {
        url: 'http://localhost:'+ process.env.PORT || 5000, // URL du serveur
      },
    ],
    components: {
      securitySchemes: {
        JWT: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        JWT: [],
      },
    ],
  },
  // Chemin vers les fichiers où se trouvent les annotations Swagger (par exemple, dans le dossier "routes")
  apis: ['./controllers/*.js'],

};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
