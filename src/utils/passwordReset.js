import jwt from 'jsonwebtoken';
import "dotenv/config";

export const generateResetToken = (user) => {
  // Genera un token de restablecimiento de contraseña que expira en 1 hora
  const token = jwt.sign({ userId: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
  return token;
};
