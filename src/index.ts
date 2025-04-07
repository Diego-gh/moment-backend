import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import userRoutes from './routes/user';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/user', userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log('Server started at localhost:' + PORT);
});
