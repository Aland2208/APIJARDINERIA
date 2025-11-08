import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getCitas = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Citas');
    res.json({ cantidad: result.length, data: result });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const postCita = async (req, res) => {
  try {
    const { id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones } = req.body;
    const [result] = await conmysql.query(
      'INSERT INTO Citas(id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones) VALUES (?,?,?,?,?)',
      [id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones]
    );
    res.json({ mensaje: 'Cita registrada exitosamente', id_cita: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};