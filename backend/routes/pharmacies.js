import express from 'express';
import { Farmacia } from '../models/Farmacia.js';
import { Comentario } from '../models/Comentario.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las reseñas de una farmacia
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la farmacia existe
    const farmacia = await Farmacia.findById(id);
    if (!farmacia) {
      return res.status(404).json({ message: 'Farmacia no encontrada' });
    }

    const comentarios = await Comentario.find({ tipo: 'farmacia', farmacia: id })
      .populate('usuario', 'nombre_apellidos')
      .sort({ fecha: -1 });

    // Formatear para el frontend
    const reviews = comentarios.map(c => {
      // Formatear fecha simple: dd/mm/yyyy
      const date = new Date(c.fecha);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      return {
        id: c._id,
        userName: c.usuario ? c.usuario.nombre_apellidos : 'Usuario Anónimo',
        rating: c.puntuacion || 5,
        comment: c.comentario,
        date: formattedDate
      };
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
});

// Añadir una reseña a una farmacia
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La puntuación debe estar entre 1 y 5' });
    }

    const farmacia = await Farmacia.findById(id);
    if (!farmacia) {
      return res.status(404).json({ message: 'Farmacia no encontrada' });
    }

    // Crear la reseña
    const nuevaResena = new Comentario({
      tipo: 'farmacia',
      usuario: req.user.id,
      farmacia: id,
      comentario: comment.trim(),
      puntuacion: rating
    });
    
    await nuevaResena.save();

    // Recalcular la media de la farmacia
    const todasLasResenas = await Comentario.find({ tipo: 'farmacia', farmacia: id });
    const sumaPuntuaciones = todasLasResenas.reduce((acc, curr) => acc + (curr.puntuacion || 5), 0);
    const media = sumaPuntuaciones / todasLasResenas.length;

    // Actualizar farmacia
    farmacia.valoracion = Number(media.toFixed(1));
    await farmacia.save();

    res.status(201).json({ message: 'Reseña publicada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar reseña', error: error.message });
  }
});

export default router;
