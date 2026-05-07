import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

// Setup environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('\n=========================================');
  console.error('⚠️  CRITICAL ERROR: No se ha configurado MongoDB');
  console.error('Por favor, añade tu string de conexión en el archivo .env');
  console.error('=========================================\n');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ Base de datos MongoDB (Atlas) conectada exitosamente');
      app.listen(PORT, () => console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`));
    })
    .catch((error) => console.log('❌ Error conectando a MongoDB:', error.message));
}
