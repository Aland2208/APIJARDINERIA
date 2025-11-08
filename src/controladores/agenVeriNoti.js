import { conmysql } from '../db.js';

export const getVerificaciones = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
      SELECT v.id_verificacion, c.id_cita, v.estado, v.observaciones, v.precio_final,
             j.nombre_completo AS jardinero
      FROM Verificaciones v
      INNER JOIN Jardineros j ON v.id_jardinero = j.id_jardinero
      INNER JOIN Citas c ON v.id_cita = c.id_cita
    `);
        res.json(result);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener verificaciones' });
    }
};

export const postAgenda = async (req, res) => {
    try {
        const { id_cita, fecha, hora, estado } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO Agenda(id_cita, fecha, hora, estado) VALUES (?,?,?,?)',
            [id_cita, fecha, hora, estado]
        );
        res.json({ mensaje: 'Agenda registrada', id_agenda: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postVerificacion = async (req, res) => {
    try {
        const { id_cita, id_jardinero, estado, observaciones, precio_final } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO Verificaciones(id_cita, id_jardinero, estado, observaciones, precio_final) VALUES (?,?,?,?,?)',
            [id_cita, id_jardinero, estado, observaciones, precio_final]
        );
        res.json({ mensaje: 'Verificación registrada', id_verificacion: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postNotificacion = async (req, res) => {
    try {
        const { id_jardinero, id_cliente, id_cita, mensaje } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO Notificaciones(id_jardinero, id_cliente, id_cita, mensaje) VALUES (?,?,?,?)',
            [id_jardinero, id_cliente, id_cita, mensaje]
        );
        res.json({ mensaje: 'Notificación creada', id_notificacion: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};
