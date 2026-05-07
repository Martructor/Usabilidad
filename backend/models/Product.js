import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    enum: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  weight: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  pharmacies: [pharmacySchema],
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
