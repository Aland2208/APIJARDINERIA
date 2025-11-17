import { conmysql } from '../db.js';

export const getVerificaciones = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
      SELECT v.id_verificacion, c.id_cita, v.estado, v.observaciones, v.precio_final,
             j.nombre_completo AS jardinero
      FROM Verificaciones v
      INNER JOIN Jardineros j ON v.id_jardinero = j.id_jardinero
      INNER JOIN Citas c ON v.id_agenda = c.id_cita
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
        const { id_cita, id_jardinero, estado, observaciones, precio_final,fecha_verificacion, hora} = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO Verificaciones(id_agenda, id_jardinero, estado, observaciones, precio_final,fecha_verificacion,hora) VALUES (?,?,?,?,?,?,?)',
            [id_cita, id_jardinero, estado, observaciones, precio_final,fecha_verificacion, hora]
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
export const getNotificacionesPorJardinero = async (req, res) => {
    try {
        const { id_jardinero } = req.params;

        if (!id_jardinero) {
            return res.status(400).json({ mensaje: 'Se requiere id_jardinero' });
        }

        const [citas] = await conmysql.query(
            `SELECT * FROM Citas 
             WHERE id_jardinero_asignado = ? 
               AND estado = 'aceptada'`,
            [id_jardinero]
        );

        if (citas.length === 0) {
            return res.json({ mensaje: "No hay citas aceptadas", notificaciones: [] });
        }

        const ids = citas.map(c => c.id_cita);

        const [agendas] = await conmysql.query(
            `
            SELECT A.*, C.ubicacion, C.referencia
            FROM Agenda A
            INNER JOIN Citas C ON C.id_cita = A.id_cita
            WHERE A.id_cita IN (?)
              AND A.estado='completada'
            ORDER BY A.fecha DESC, A.hora DESC
            `,
            [ids]
        );

        const notificaciones = agendas.map(a => ({
            id_cita: a.id_cita,
            estado: a.estado,
            ubicacion: a.ubicacion,
            referencia: a.referencia,
            fecha: a.fecha,
            hora: a.hora,
            descripcion: "Visita completada."
        }));

        res.json({ cantidad: notificaciones.length, notificaciones });

    } catch (error) {
        console.error("Error en getNotificacionesPorJardinero:", error);
        res.status(500).json({ mensaje: "Error interno al obtener notificaciones" });
    }
};
