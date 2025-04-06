import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  connectDB();
  console.log('Server started at localhost:' + PORT);
});
