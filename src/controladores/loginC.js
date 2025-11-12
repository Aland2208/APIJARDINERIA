import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const login = async (req, res) => {
  const { username, password, tipo } = req.body;
  try {
    let tablaLogin, campoId, tablaDatos, campoNombre;

    if (tipo === 'jardinero') {
      tablaLogin = 'Login_Jardineros';
      campoId = 'id_jardinero';
      tablaDatos = 'Jardineros';
      campoNombre = 'nombre_completo';
    } else if (tipo === 'cliente') {
      tablaLogin = 'Login_Clientes';
      campoId = 'id_cliente';
      tablaDatos = 'Clientes';
      campoNombre = 'nombre_completo';
    } else {
      return res.status(400).json({ estado: 0, mensaje: 'Tipo de usuario inválido' });
    }

    const [rows] = await conmysql.query(
      `SELECT * FROM ${tablaLogin} WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ estado: 0, mensaje: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const hashIngresado = crypto.createHash('md5').update(password).digest('hex');

    if (hashIngresado !== user.password_hash) {
      return res.status(401).json({ estado: 0, mensaje: 'Contraseña incorrecta' });
    }

    // 🧠 Si es el admin especial:
    if (username === 'admin') {
      const token = jwt.sign(
        {
          id: 0,
          tipo: 'admin',
          nombre: 'Administrador General',
          email: 'admin@app.com',
          isAdmin: true
        },
        JWT_SECRET,
        { expiresIn: '365d' } // token válido por 1 año
      );

      return res.json({
        estado: 1,
        mensaje: 'Login exitoso como administrador',
        token,
        usuario: {
          id: 0,
          nombre_completo: 'Administrador General',
          email: 'admin@app.com',
          tipo: 'admin'
        }
      });
    }

    // 🧾 Si es un usuario normal (cliente o jardinero)
    const [info] = await conmysql.query(
      `SELECT * FROM ${tablaDatos} WHERE ${campoId} = ?`,
      [user[campoId]]
    );
    const datos = info[0];

    const token = jwt.sign(
      {
        id: datos[campoId],
        tipo,
        nombre: datos[campoNombre],
        email: datos.email,
        isAdmin: false
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      estado: 1,
      mensaje: 'Login exitoso',
      token,
      usuario: datos
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ estado: 0, mensaje: 'Internal server error' });
  }
};
