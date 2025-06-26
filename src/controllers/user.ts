import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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

export const registerUser = async (req: Request, res: Response) => {
  const { error } = registerUserParams.safeParse(req.body);

  if (error) {
    res.status(400).json({ message: 'Some required fields are missing' });
    console.error('register user validation error:', error);
    return;
  }

  const { displayName, username, email, password } = req.body;

  if (reservedUsernames.includes(username)) {
    res.status(400).json({ message: 'Username is not available' });
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
      res.status(500).json({ message: 'Error creating user' });
      return;
    }

    const token = generateJwtToken(newUser._id.toString());

    const { hashedPassword: _, ...userWithoutPassword } = newUser.toObject();

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
    });

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { error } = loginUserParams.safeParse(req.body);

  if (error) {
    res.status(400).json({ message: 'Some required fields are missing' });
    console.error('login user validation error:', error);
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'Email not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token = generateJwtToken(user._id.toString());

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
    });

    const { hashedPassword, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie(cookieName);

  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserData = async (req: Request, res: Response) => {
  const { error } = getUserParams.safeParse(req.params);

  if (error) {
    res.status(400).json({ message: 'Username is required' });
    console.error('get user validation error:', error);
    return;
  }

  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { hashedPassword, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};
