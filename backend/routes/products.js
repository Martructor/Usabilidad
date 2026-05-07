import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});

// Crear un nuevo producto (incluyendo su primera farmacia)
router.post('/', async (req, res) => {
  try {
    const { name, image, weight, type, pharmacy } = req.body;
    
    // Validación básica
    if (!name || !image || !weight || !type || !pharmacy) {
      return res.status(400).json({ message: 'Todos los campos del producto y de la farmacia son obligatorios' });
    }

    const newProduct = new Product({
      name,
      image,
      weight,
      type,
      pharmacies: [pharmacy] // Añadimos la farmacia inicial
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// Añadir una farmacia a un producto existente
router.post('/:id/pharmacies', async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.pharmacies.push(pharmacy);
    await product.save();

    res.json({ message: 'Farmacia añadida al producto exitosamente', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la farmacia', error: error.message });
  }
});

export default router;
