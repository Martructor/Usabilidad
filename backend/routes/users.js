import express from 'express';
import { Usuario } from '../models/User.js';
import { Item } from '../models/Item.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-contrasena');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Actualizar perfil del usuario y notificaciones
router.put('/profile', auth, async (req, res) => {
  try {
    const { nombre_apellidos, email, telefono, direccion, notificaciones } = req.body;
    
    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (nombre_apellidos) usuario.nombre_apellidos = nombre_apellidos;
    if (email) usuario.email = email;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (direccion !== undefined) usuario.direccion = direccion;
    
    if (notificaciones) {
      if (notificaciones.push !== undefined) usuario.ajustes.notificaciones.push = notificaciones.push;
      if (notificaciones.email !== undefined) usuario.ajustes.notificaciones.email = notificaciones.email;
      if (notificaciones.ofertas !== undefined) usuario.ajustes.notificaciones.ofertas = notificaciones.ofertas;
    }

    await usuario.save();
    
    res.json({ message: 'Perfil actualizado', usuario: {
      nombre_apellidos: usuario.nombre_apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      notificaciones: usuario.ajustes.notificaciones
    }});
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Añadir o quitar favorito
router.post('/favorites', auth, async (req, res) => {
  try {
    const { productId, pharmacyId } = req.body;
    
    if (!productId || !pharmacyId) {
      return res.status(400).json({ message: 'Faltan campos' });
    }

    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comprobar si ya existe en favoritos
    const index = usuario.favoritos.findIndex(
      fav => fav.productoId.toString() === productId && fav.farmaciaId.toString() === pharmacyId
    );

    if (index > -1) {
      // Si existe, lo quitamos (toggle)
      usuario.favoritos.splice(index, 1);
      await usuario.save();
      return res.json({ message: 'Favorito eliminado', favoritos: usuario.favoritos });
    } else {
      // Si no existe, lo añadimos
      usuario.favoritos.push({ productoId: productId, farmaciaId: pharmacyId });
      await usuario.save();
      return res.json({ message: 'Favorito añadido', favoritos: usuario.favoritos });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Obtener la lista de favoritos del usuario
router.get('/favorites', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id)
      .populate({
        path: 'favoritos.productoId',
        select: 'nombre foto categoria peso farmacias',
        populate: {
          path: 'farmacias.farmacia',
          select: 'nombre ciudad direccion coordenadas'
        }
      });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Formatear los favoritos para que coincidan con la estructura del frontend
    const formattedFavorites = usuario.favoritos.map(fav => {
      const producto = fav.productoId;
      if (!producto) return null;

      // Buscar la farmacia específica dentro de las farmacias del producto
      const farmaciaInfo = producto.farmacias.find(f => 
        f.farmacia && f.farmacia._id.toString() === fav.farmaciaId.toString()
      );

      if (!farmaciaInfo || !farmaciaInfo.farmacia) return null;

      return {
        id: producto._id,
        favoriteId: fav._id, // para identificar la relación
        pharmacyId: fav.farmaciaId, // para saber qué farmacia se guardó
        name: producto.nombre,
        image: producto.foto,
        category: producto.categoria,
        weight: producto.peso,
        price: farmaciaInfo.precio,
        location: farmaciaInfo.farmacia.ciudad.nombre,
        seller: farmaciaInfo.farmacia.nombre,
        lat: farmaciaInfo.farmacia.coordenadas.latitud,
        lng: farmaciaInfo.farmacia.coordenadas.longitud
      };
    }).filter(f => f !== null);

    res.json(formattedFavorites);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

export default router;
