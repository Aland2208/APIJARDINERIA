export const permitirRol = (...rolesPermitidos) => (req, res, next) => {
  const { rol } = req.usuario; // se supone que verifyToken agrega `req.usuario`
  if (!rolesPermitidos.includes(rol)) {
    return res.status(403).json({ mensaje: 'No tienes permisos' });
  }
  next();
};