import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, location, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Este correo electrónico ya está registrado' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    user = new User({
      fullName,
      email,
      location,
      password: hashedPassword,
    });
    await user.save();

    // Create session token
    const payload = {
      user: { id: user.id }
    };
    
    // Using a fallback secret key for development if env is not set
    const jwtSecret = process.env.JWT_SECRET || 'boticario_super_secret';
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: { fullName: user.fullName, email: user.email } });
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Route: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No existe una cuenta con este correo electrónico' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Return token
    const payload = {
      user: { id: user.id }
    };

    const jwtSecret = process.env.JWT_SECRET || 'boticario_super_secret';
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { fullName: user.fullName, email: user.email } });
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

export default router;
