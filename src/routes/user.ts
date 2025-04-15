import express from 'express';
import {
  registerUser,
  getUser,
  loginUser,
  logoutUser,
} from '../controllers/user';

const router = express.Router();

router.get('/:username', getUser);
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser);

export default router;
