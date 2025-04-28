import express from 'express';
import {
  registerUser,
  getUser,
  loginUser,
  logoutUser,
} from '../controllers/user';

const router = express.Router();

router.get('/:username', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
