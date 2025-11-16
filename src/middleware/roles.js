export const permitirRol = (...rolesPermitidos) => (req, res, next) => {
  const { tipo } = req.usuario; 
  if (!rolesPermitidos.includes(tipo)) {
    return res.status(403).json({ mensaje: 'No tienes permisos' });
  }
  next();
};