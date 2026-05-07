import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['producto', 'farmacia'], required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  farmacia: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmacia' },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

export const Comentario = mongoose.model('Comentario', comentarioSchema);