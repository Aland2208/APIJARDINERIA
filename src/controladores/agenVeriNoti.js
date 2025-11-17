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
export const validarAgenda = async (req, res) => {
    try {
        const { id_jardinero, fecha, hora } = req.body;

        const [result] = await conmysql.query(`
            SELECT a.id_agenda
            FROM Agenda a
            INNER JOIN Citas c ON a.id_cita = c.id_cita
            WHERE c.id_jardinero_asignado = ?
              AND a.fecha = ?
              AND a.hora = ?
              AND a.estado IN ('pendiente', 'confirmada')
        `, [id_jardinero, fecha, hora]);

        if (result.length > 0) {
            return res.status(400).json({ mensaje: 'El jardinero ya tiene una cita en esa fecha y hora' });
        }

        res.json({ mensaje: 'No hay conflictos en la agenda' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error validando agenda', error });
    }
};
export const getAgendaPorCita = async (req, res) => {
    try {
        const { id_cita } = req.params;

        if (!id_cita) {
            return res.status(400).json({ mensaje: 'Se requiere id_cita' });
        }

        const [result] = await conmysql.query(
            'SELECT * FROM Agenda WHERE id_cita = ?',
            [id_cita]
        );

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró agenda para esta cita' });
        }

        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        console.error('Error en getAgendaPorCita:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener agenda' });
    }
};
export const updateAgendaPorCita = async (req, res) => {
    try {
        const { id_cita } = req.params;
        const { fecha, hora, estado } = req.body;

        if (!id_cita) {
            return res.status(400).json({ mensaje: 'Se requiere id_cita' });
        }

        // Verificar si existe una agenda asociada a ese id_cita
        const [existe] = await conmysql.query(
            'SELECT * FROM Agenda WHERE id_cita = ?',
            [id_cita]
        );

        if (existe.length === 0) {
            return res.status(404).json({ mensaje: 'No existe agenda asociada a esta cita' });
        }

        // Actualizar datos
        const [result] = await conmysql.query(
            `UPDATE Agenda 
             SET fecha = ?, hora = ?, estado = ? 
             WHERE id_cita = ?`,
            [fecha, hora, estado, id_cita]
        );

        res.json({
            mensaje: 'Agenda actualizada correctamente',
            cambios: result.affectedRows
        });

    } catch (error) {
        console.error('Error en updateAgendaPorCita:', error);
        res.status(500).json({ mensaje: 'Error interno al actualizar agenda' });
    }
};
export const getAgendaPorCitaEstado = async (req, res) => {
    try {
        const { id_cita } = req.params;

        if (!id_cita) {
            return res.status(400).json({ mensaje: 'Se requiere id_cita' });
        }

        const [result] = await conmysql.query(
            'SELECT * FROM Agenda WHERE id_cita = ? and estado = "completada"',
            [id_cita]
        );

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontró agenda para esta cita' });
        }

        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        console.error('Error en getAgendaPorCita:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener agenda' });
    }
};