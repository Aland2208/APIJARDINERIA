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
    const { id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones, id_jardinero_asignado } = req.body;

    const [result] = await conmysql.query(
      'INSERT INTO Citas(id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones, id_jardinero_asignado) VALUES (?,?,?,?,?,?)',
      [id_cliente, id_tipo_trabajo, ubicacion, referencia, observaciones, id_jardinero_asignado || null]
    );

    res.json({ mensaje: 'Cita registrada exitosamente', id_cita: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
}
export const getCitasPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params; // obtenemos el id_cliente de la URL
    if (!id_cliente) {
      return res.status(400).json({ mensaje: 'Se requiere id_cliente' });
    }

    const [result] = await conmysql.query(
      'SELECT * FROM Citas WHERE id_cliente = ? and estado = "pendiente"',
      [id_cliente]
    );

    res.json({ cantidad: result.length, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
}
// Cancelar cita por id
export const cancelarCita = async (req, res) => {
  try {
    const { id_cita } = req.params;

    if (!id_cita) {
      return res.status(400).json({ mensaje: 'Se requiere id_cita' });
    }

    // Verificar si la cita existe y está pendiente
    const [citas] = await conmysql.query(
      'SELECT * FROM Citas WHERE id_cita = ? AND estado = "pendiente"',
      [id_cita]
    );

    if (citas.length === 0) {
      return res.status(404).json({ mensaje: 'La cita no existe o no se puede cancelar' });
    }

    // Actualizar estado a cancelada
    await conmysql.query(
      'UPDATE Citas SET estado = "cancelada" WHERE id_cita = ?',
      [id_cita]
    );

    res.json({ mensaje: 'Cita cancelada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

