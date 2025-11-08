export const permitirRol = (rolRequerido) => {
  return (req, res, next) => {
    const { tipo } = req.usuario; // viene del token
    if (tipo !== rolRequerido) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
  };
};