import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './utils/db';
import userRoutes from './routes/user';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log('Server started at localhost:' + PORT);
});
