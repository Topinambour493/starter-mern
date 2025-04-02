import path from "path";

/**
 * @swagger
 * /uploads/{filename}:
 *   get:
 *     summary: Récupère une image depuis le serveur
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         description: Le nom du fichier image à récupérer
 *         schema:
 *           type: string
 *     tags:
 *       - Image
 *     responses:
 *       200:
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
export const getImage = async (req, res) => {
  res.sendFile(path.resolve('uploads', req.params.filename));
};