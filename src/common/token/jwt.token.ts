import * as jwt from 'jsonwebtoken';

export interface JwtPayLoad {
  email: string;
  exp: number;
  iat: number;
}

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
    expiresIn: '1d',
  });
  return token;
};

export const forgotPasswordToken = async (email: string) => {
  const payload = { email }; // Wrap the email string in an object
  const expiresIn = '1h'; // Use a string to represent the expiration time (1 hour)

  const token = jwt.sign(payload, process.env.JWT_FORGOT_PASSWORD, {
    expiresIn,
  });

  return token;
};
