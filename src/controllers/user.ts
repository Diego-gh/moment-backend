import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { generateJwtToken } from '../utils/crypto';

const cookieMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

export const createUser = async (req: Request, res: Response) => {
  try {
    const { displayName, username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Some required fields are missing' });
      return;
    }

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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Some required fields are missing' });
      return;
    }

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

    res.cookie('token', token, {
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
  res.clearCookie('token');

  res.status(200).json({ message: 'Logged out successfully' });
};
