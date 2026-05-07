import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, location, password } = req.body;

    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario (mapeo de campos del frontend)
    usuario = new Usuario({
      email,
      nombre_apellidos: fullName,
      lugar_residencia: {
        ciudad: location,
        pais: 'España'
      },
      contrasena: hashedPassword
    });
    await usuario.save();

    // Generar token
    const payload = { user: { id: usuario.id } };
    const jwtSecret = process.env.JWT_SECRET || 'boticario_super_secret';
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        user: { fullName: usuario.nombre_apellidos, email: usuario.email }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Correo no registrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const payload = { user: { id: usuario.id } };
    const jwtSecret = process.env.JWT_SECRET || 'boticario_super_secret';
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: { fullName: usuario.nombre_apellidos, email: usuario.email }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

export default router;