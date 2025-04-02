#!/bin/bash

# Récupère le nom du dossier courant
CURRENT_DIR=$(basename "$PWD")

# Déplace les dossiers front et back dans le dossier parent
mv back ../

# Remonte d'un niveau
cd ..

# Supprime l'ancien dossier cloné (la "coquille")
rm -rf "$CURRENT_DIR"

echo "✅ Setup terminé"
