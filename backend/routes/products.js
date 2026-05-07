import express from 'express';
import { Item } from '../models/Item.js';
import { Farmacia } from '../models/Farmacia.js';

const router = express.Router();

// Obtener todos los productos (con farmacias pobladas)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
      .populate('farmacias.farmacia')
      .sort({ createdAt: -1 });
    
    // Formatear para que coincida con el frontend
    const products = items.map(item => ({
      id: item._id,
      name: item.nombre,
      image: item.foto,
      category: item.categoria,
      weight: item.peso,
      locations: item.farmacias.map(f => ({
        id: f.farmacia._id,
        location: f.farmacia.ciudad.nombre,
        seller: f.farmacia.nombre,
        price: f.precio,
        rating: f.farmacia.valoracion,
        address: f.farmacia.direccion || '',
        lat: f.farmacia.coordenadas.latitud,
        lng: f.farmacia.coordenadas.longitud
      }))
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Crear producto y su farmacia inicial
router.post('/', async (req, res) => {
  try {
    const { name, image, weight, type, pharmacy } = req.body;
    if (!name || !image || !weight || !type || !pharmacy) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crear la farmacia
    const nuevaFarmacia = new Farmacia({
      nombre: pharmacy.name,
      ciudad: {
        nombre: pharmacy.location,
        pais: 'España'
      },
      direccion: pharmacy.address || '',
    });
    await nuevaFarmacia.save();

    // Crear el item con referencia a la farmacia
    const nuevoItem = new Item({
      foto: image,
      nombre: name,
      categoria: type,
      peso: weight,
      farmacias: [{ farmacia: nuevaFarmacia._id, precio: pharmacy.price }]
    });
    await nuevoItem.save();

    res.status(201).json({ message: 'Producto creado', product: nuevoItem });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
});

// Añadir una farmacia a un producto existente
router.post('/:id/pharmacies', async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = req.body; // { name, location, address, price }

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

    // Crear la farmacia
    const nuevaFarmacia = new Farmacia({
      nombre: pharmacy.name,
      ciudad: { nombre: pharmacy.location },
      direccion: pharmacy.address
    });
    await nuevaFarmacia.save();

    // Añadir al array de farmacias del item
    item.farmacias.push({ farmacia: nuevaFarmacia._id, precio: pharmacy.price });
    await item.save();

    res.json({ message: 'Farmacia añadida', item });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir farmacia', error: error.message });
  }
});

export default router;