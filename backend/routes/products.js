import express from 'express';
import multer from 'multer';
import path from 'path';
import { Item } from '../models/Item.js';
import { Farmacia } from '../models/Farmacia.js';
import { Comentario } from '../models/Comentario.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, weight, type, pharmacy } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    let parsedPharmacy;
    try {
      parsedPharmacy = typeof pharmacy === 'string' ? JSON.parse(pharmacy) : pharmacy;
    } catch(e) {
      parsedPharmacy = pharmacy;
    }

    if (!name || !image || !weight || !type || !parsedPharmacy) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crear la farmacia
    const nuevaFarmacia = new Farmacia({
      nombre: parsedPharmacy.name,
      ciudad: {
        nombre: parsedPharmacy.location,
        pais: 'España'
      },
      direccion: parsedPharmacy.address || '',
    });
    await nuevaFarmacia.save();

    // Crear el item con referencia a la farmacia
    const nuevoItem = new Item({
      foto: image,
      nombre: name,
      categoria: type,
      peso: weight,
      farmacias: [{ farmacia: nuevaFarmacia._id, precio: parsedPharmacy.price }]
    });
    await nuevoItem.save();

    res.status(201).json({ message: 'Producto creado', product: nuevoItem });
  } catch (error) {
    console.error('Error al crear producto:', error);
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
      direccion: pharmacy.address,
      coordenadas: {
        latitud: pharmacy.lat || null,
        longitud: pharmacy.lng || null
      }
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

// Obtener comentarios de un producto
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

    const comentarios = await Comentario.find({ tipo: 'producto', item: id })
      .populate('usuario', 'nombre_apellidos')
      .sort({ fecha: -1 });

    res.json(comentarios.map(c => ({
      id: c._id,
      usuario: c.usuario ? c.usuario.nombre_apellidos : null,
      usuarioId: c.usuario ? c.usuario._id : null,
      comentario: c.comentario,
      fecha: c.fecha
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
});

// Añadir un comentario a un producto
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, comentario } = req.body; // usuario opcional

    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

    const nuevoComentario = new Comentario({
      tipo: 'producto',
      usuario: usuario || null,
      item: item._id,
      comentario: comentario.trim()
    });
    await nuevoComentario.save();

    res.status(201).json({ message: 'Comentario añadido', comment: nuevoComentario });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir comentario', error: error.message });
  }
});

export default router;