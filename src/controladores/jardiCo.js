import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getJardineros = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Jardineros');
    res.json({ cantidad: result.length, data: result });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const getJardineroById = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Jardineros WHERE id_jardinero = ?', [req.params.id]);
    if (result.length <= 0) return res.json({ cantidad: 0, mensaje: 'Jardinero no encontrado' });
    res.json({ cantidad: result.length, data: result[0] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};
export const getJardineroTelefono = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Jardineros WHERE telefono = ?', [req.params.telefono]);
    if (result.length <= 0) return res.json({ cantidad: 0, mensaje: 'Jardinero no encontrado' });
    res.json({ cantidad: result.length, data: result[0] });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const postJardinero = async (req, res) => {
  try {
    const { nombre_completo, email, telefono, direccion, username, password } = req.body;

    const [insertJardinero] = await conmysql.query(
      'INSERT INTO Jardineros(nombre_completo, email, telefono, direccion) VALUES (?,?,?,?)',
      [nombre_completo, email, telefono, direccion]
    );

    const id_jardinero = insertJardinero.insertId;
    const hash = crypto.createHash('md5').update(password).digest('hex');

    await conmysql.query(
      'INSERT INTO Login_Jardineros(id_jardinero, username, password_hash) VALUES (?,?,?)',
      [id_jardinero, username, hash]
    );

    res.json({ mensaje: 'Jardinero registrado exitosamente', id_jardinero });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const putJardinero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, telefono, direccion } = req.body;

    const [result] = await conmysql.query(
      'UPDATE Jardineros SET nombre_completo=?, email=?, telefono=?, direccion=? WHERE id_jardinero=?',
      [nombre_completo, email, telefono, direccion, id]
    );

    if (result.affectedRows <= 0) return res.status(404).json({ mensaje: 'Jardinero no encontrado' });

    const [fila] = await conmysql.query('SELECT * FROM Jardineros WHERE id_jardinero=?', [id]);
    res.json(fila[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const deleteJardinero = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query('DELETE FROM Jardineros WHERE id_jardinero=?', [id]);
    if (result.affectedRows <= 0) return res.status(404).json({ mensaje: 'Jardinero no encontrado' });
    res.json({ mensaje: 'Jardinero eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};
