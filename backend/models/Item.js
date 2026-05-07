import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  foto: { type: String, required: true },
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, default: '' },
  categoria: { type: String, required: true },
  peso: { type: String, required: true },
  // Array de farmacias con su precio específico
  farmacias: [{
    farmacia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmacia',
      required: true
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);