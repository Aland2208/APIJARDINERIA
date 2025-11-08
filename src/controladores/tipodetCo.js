import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getTiposTrabajo = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Tipos_Trabajo');
    res.json({ cantidad: result.length, data: result });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const postTipoTrabajo = async (req, res) => {
  try {
    const { nombre_tipo, descripcion } = req.body;
    const [result] = await conmysql.query(
      'INSERT INTO Tipos_Trabajo(nombre_tipo, descripcion) VALUES (?,?)',
      [nombre_tipo, descripcion]
    );
    res.json({ mensaje: 'Tipo de trabajo agregado', id_tipo_trabajo: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};