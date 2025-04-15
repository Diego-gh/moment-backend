import { z } from 'zod';
import mongoose from 'mongoose';

// Constants for validation
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 64;
const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 32;
const DISPLAY_NAME_MIN_LENGTH = 2;
const DISPLAY_NAME_MAX_LENGTH = 32;

// Common validation rules
const email = z.string().email();
const password = z
  .string()
  .trim()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH);
const username = z
  .string()
  .trim()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH)
  .toLowerCase();
const displayName = z
  .string()
  .trim()
  .min(DISPLAY_NAME_MIN_LENGTH)
  .max(DISPLAY_NAME_MAX_LENGTH)
  .optional();
const profileImage = z
  .object({
    url: z.string().url(),
    publicId: z.string(),
  })
  .optional();
const bannerImage = z
  .object({
    url: z.string().url(),
    publicId: z.string(),
  })
  .optional();
const objectId = z.string().refine((val) => mongoose.isValidObjectId(val), {
  message: 'Invalid ObjectId',
});
const followers = z.array(objectId).optional();
const following = z.array(objectId).optional();

// Validation schemas
export const registerUserParams = z.object({
  displayName,
  username,
  email,
  password,
  profileImage,
  bannerImage,
  followers,
  following,
});

export const loginUserParams = z.object({
  email,
  password,
});

export const getUserParams = z.object({
  username,
});
