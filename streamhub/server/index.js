import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import streamRoutes from './routes/stream.js';
import streamKeyRoutes from './routes/stream-key.js';
// Import NMS for stream handling
import './nms.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api', streamKeyRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Backend working and mongodb connected!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server working: http://localhost:${PORT}`);
});

