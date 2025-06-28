import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { generateJwtToken } from '../utils/crypto';
import { reservedUsernames } from '../constants';
import {
  registerUserParams,
  loginUserParams,
  getUserParams,
} from '../validation/user';

const cookieMaxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
const cookieName = 'jwt';

interface JwtPayload {
  userId: string;
  iat: number;
}

const removeSensitiveData = (user: any) => {
  const { _id, hashedPassword, createdAt, updatedAt, __v, ...rest } =
    user.toObject();
  return rest;
};

export const registerUser = async (req: Request, res: Response) => {
  const { error } = registerUserParams.safeParse(req.body);

  if (error) {
    res.status(400); // Bad Request
    return;
  }

  const { displayName, username, email, password } = req.body;

  if (reservedUsernames.includes(username)) {
    res.status(409);
    return;
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409);
      return;
    }
  } catch (error) {
    res.status(500);
    return;
  }

  try {
    console.log('Creating user with data:', req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      displayName: displayName,
      username,
      email,
      hashedPassword: hashedPassword,
    });

    if (!newUser) {
      res.status(500);
      return;
    }

    const token = generateJwtToken(newUser._id.toString());

    const userData = removeSensitiveData(newUser);

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
    });

    res.status(200).json(userData);
  } catch (error) {
    res.status(500);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { error } = loginUserParams.safeParse(req.body);

  if (error) {
    res.status(400);
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      res.status(401);
      return;
    }

    const token = generateJwtToken(user._id.toString());

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
    });

    const userData = removeSensitiveData(user);

    res.status(200).json(userData);
  } catch (error) {
    res.status(500);
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie(cookieName);

  res.status(200);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const token = req.cookies?.[cookieName];

  if (!token) {
    res.status(401);
    return;
  }

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  try {
    const user = await User.findById(decodedToken?.userId);
    if (!user) {
      res.status(404);
      return;
    }

    const userData = removeSensitiveData(user);

    res.status(200).json(userData);
  } catch (error) {
    res.status(500);
  }
};

export const getUserData = async (req: Request, res: Response) => {
  const { error } = getUserParams.safeParse(req.params);

  if (error) {
    res.status(400);
    return;
  }

  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404);
      return;
    }

    const userData = removeSensitiveData(user);

    res.status(200).json(userData);
  } catch (error) {
    res.status(500);
  }
};
