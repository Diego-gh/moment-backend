import jwt from 'jsonwebtoken';

export const generateJwtToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string);
};
