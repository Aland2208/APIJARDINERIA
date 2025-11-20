import { conmysql } from '../db.js';
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
export const getJardinerosByIdLoginJard = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM Login_Jardineros WHERE id_jardinero = ?', [req.params.id]);
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
    const { nombre_completo, email, telefono, direccion, foto, username, password } = req.body;

    const [insertJardinero] = await conmysql.query(
      'INSERT INTO Jardineros(nombre_completo, email, telefono, direccion, foto) VALUES (?,?,?,?,?)',
      [nombre_completo, email, telefono, direccion, foto || null]
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
    const { nombre_completo, email, telefono, direccion, foto, username, password } = req.body;

    // 1️⃣ Actualizar tabla Jardineros
    const [result] = await conmysql.query(
      'UPDATE Jardineros SET nombre_completo=?, email=?, telefono=?, direccion=?, foto=? WHERE id_jardinero=?',
      [nombre_completo, email, telefono, direccion, foto || null, id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ mensaje: 'Jardinero no encontrado' });
    }

    // 2️⃣ Actualizar tabla Login_Jardineros si hay username o password
    if (username || password) {
      const updates = [];
      const values = [];

      if (username) {
        updates.push('username=?');
        values.push(username);
      }

      if (password) {
        const hash = crypto.createHash('md5').update(password).digest('hex');
        updates.push('password_hash=?');
        values.push(hash);
      }

      if (updates.length > 0) {
        const query = `UPDATE Login_Jardineros SET ${updates.join(', ')} WHERE id_jardinero=?`;
        values.push(id);
        await conmysql.query(query, values);
      }
    }

    // 3️⃣ Traer datos combinados de Jardineros + Login_Jardineros
    const [jardinero] = await conmysql.query('SELECT * FROM Jardineros WHERE id_jardinero=?', [id]);
    const [login] = await conmysql.query('SELECT username FROM Login_Jardineros WHERE id_jardinero=?', [id]);

    const jardineroActualizado = {
      ...jardinero[0],
      username: login[0]?.username || null
    };

    res.json(jardineroActualizado);

  } catch (error) {
    console.error(error);
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

export const getEstadisticaTrabajos = async (req, res) => {
  try {
    const id_jardinero = req.params.id;

    const [result] = await conmysql.query(`
      SELECT 
          tt.nombre_tipo AS tipo_trabajo,
          c.estado AS estado_cita,
          COUNT(*) AS total
      FROM Citas c
      INNER JOIN Agenda a ON c.id_cita = a.id_cita
      INNER JOIN Tipos_Trabajo tt ON c.id_tipo_trabajo = tt.id_tipo_trabajo
      WHERE a.id_jardinero = ?
      GROUP BY tt.nombre_tipo, c.estado
      ORDER BY tt.nombre_tipo, c.estado;
    `, [id_jardinero]);

    res.json({ cantidad: result.length, data: result });

  } catch (error) {
    console.error("Error en getEstadisticaTrabajos:", error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};
