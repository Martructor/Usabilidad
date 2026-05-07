import mongoose from 'mongoose';

const farmaciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  valoracion: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ciudad: {
    nombre: { type: String, required: true },
    pais: { type: String, default: 'España' }
  },
  coordenadas: {
    latitud: { type: Number, default: null },
    longitud: { type: Number, default: null }
  },
  horario: {
    type: String,
    default: 'L-V 9:00-21:00, S 10:00-14:00'
  },
  direccion: { type: String, trim: true } // Para el campo address del frontend
}, { timestamps: true });

export const Farmacia = mongoose.model('Farmacia', farmaciaSchema);