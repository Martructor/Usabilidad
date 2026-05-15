import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import pharmacyRoutes from './routes/pharmacies.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Configurar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Servir la carpeta de subidas estáticamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacies', pharmacyRoutes);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('⚠️  Faltante MONGO_URI en .env');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB conectada');
      app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
    })
    .catch(err => console.error('❌ Error MongoDB:', err.message));
}