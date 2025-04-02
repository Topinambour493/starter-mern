import bcrypt from 'bcrypt';

// Fonction pour hasher un mot de passe
export const hashPassword = (plainPassword) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
  return bcrypt.hashSync(plainPassword, saltRounds);
};

// Fonction pour vérifier un mot de passe
export const checkPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
