import express from 'express';
import {
  registerUser,
  getUserData,
  loginUser,
  logoutUser,
} from '../controllers/user';

const router = express.Router();

router.get('/:username', getUserData);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
