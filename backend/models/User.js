import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  nombre_apellidos: {
    type: String,
    required: true,
    trim: true
  },
  lugar_residencia: {
    ciudad: { type: String, required: true },
    pais: { type: String, default: 'España' }
  },
  contrasena: {
    type: String,
    required: true
  },
  telefono: String,
  fecha_nacimiento: String,
  ajustes: {
    notificaciones: { type: Boolean, default: true },
    privacidad: { type: String, default: 'publico' },
    idioma: { type: String, default: 'es' },
    tema: { type: String, default: 'claro' }
  },
  favoritos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    farmaciaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmacia' }
  }]
}, { timestamps: true });

export const Usuario = mongoose.model('Usuario', usuarioSchema);