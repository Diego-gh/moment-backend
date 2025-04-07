import express from 'express';
import { test } from '../controllers/post';

const router = express.Router();

router.get('/test', test);

export default router;
