import jwt from 'jsonwebtoken';

export const generateToken = (id, scope) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
  }

  const expiration =
    scope === 'access'
      ? process.env.JWT_EXPIRATION || '1h'
      : process.env.JWT_REFRESH_EXPIRATION || '7d';

  const options = {
    expiresIn: expiration,
  };

  return jwt.sign(
    { time: new Date().toISOString(), userId: id, scope },
    process.env.JWT_SECRET_KEY,
    options,
  );
};
