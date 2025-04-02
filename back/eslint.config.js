import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import unusedImports from 'eslint-plugin-unused-imports';  // Ajout du plugin pour les imports inutilisés

export default defineConfig([
  // Configuration des fichiers JavaScript (Node.js)
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.browser, process: 'readonly' } },  // Ajout de 'process' pour Node.js
  },

  // Extension des règles JS de base
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  // Configuration spécifique pour supprimer les imports inutilisés
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      'unused-imports': unusedImports,  // Plugin pour supprimer les imports inutilisés
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',  // Supprime les imports inutilisés
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],  // Avertir sur les variables inutilisées
    },
  },
]);
