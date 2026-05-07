import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  // Obtener el token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, permiso denegado' });
  }

  // Verificar el token
  try {
    const jwtSecret = process.env.JWT_SECRET || 'boticario_super_secret';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
}
