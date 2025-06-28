import express from 'express';
import {
  registerUser,
  getUserData,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/user';

const router = express.Router();

router.get('/', getCurrentUser);
router.get('/:username', getUserData);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
