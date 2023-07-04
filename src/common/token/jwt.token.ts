import * as jwt from 'jsonwebtoken';

export const createToken = async (id: string, email: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

export const refreshToken = async (id: string, email: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '3h',
  });
  return token;
};
