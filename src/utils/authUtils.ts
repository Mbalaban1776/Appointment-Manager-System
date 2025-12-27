import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (candidate: string, hash: string) => {
  return await bcrypt.compare(candidate, hash);
};

