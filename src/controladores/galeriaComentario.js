import { conmysql } from '../db.js';

export const getGaleria = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Galeria');
        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};


export const getGaleriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await conmysql.query(
            `SELECT * FROM Galeria WHERE id_galeria = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Foto no encontrada" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Error en getGaleriaById:", error);
        res.status(500).json({ mensaje: "Internal server error" });
    }
};


export const postGaleria = async (req, res) => {
    try {
        const { id_jardinero, id_cliente, titulo, descripcion, tipo, fecha } = req.body;

        // URL de Cloudinary ya procesada por Multer
        const url_foto = req.file ? req.file.path : null;

        if (!url_foto) {
            return res.status(400).json({ mensaje: 'Debe subir una imagen' });
        }

        // 📌 Si no mandan fecha, se usa CURRENT_TIMESTAMP
        const fecha_final = fecha ? fecha : null;

        const [result] = await conmysql.query(
            `INSERT INTO Galeria(id_jardinero, id_cliente, titulo, descripcion, tipo, url_foto, fecha)
             VALUES (?,?,?,?,?,?,?)`,
            [id_jardinero, id_cliente, titulo, descripcion, tipo, url_foto, fecha_final]
        );

        res.json({
            mensaje: 'Foto subida correctamente',
            id_galeria: result.insertId,
            url_foto
        });

    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};


export const deleteGaleria = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await conmysql.query(
            `DELETE FROM Galeria WHERE id_galeria = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Foto no encontrada" });
        }

        res.json({ estado: 1, mensaje: "Foto eliminada correctamente" });

    } catch (error) {
        console.error("Error en deleteGaleria:", error);
        res.status(500).json({ mensaje: "Internal server error" });
    }
};

export const getComentario = async (req, res) => {
    try {
        const { id_galeria } = req.query;

        if (!id_galeria) {
            return res.status(400).json({ mensaje: 'Falta id_galeria' });
        }

        const [result] = await conmysql.query(
            'SELECT * FROM Comentarios_Galeria WHERE id_galeria = ?',
            [id_galeria]
        );

        res.json({ cantidad: result.length, data: result });

    } catch (error) {
        console.error("Error en getComentariosPorGaleria:", error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postComentario = async (req, res) => {
    try {
        const { id_galeria, id_cliente, mensaje, estrellas } = req.body;

        const [result] = await conmysql.query(
            `INSERT INTO Comentarios_Galeria(id_galeria, id_cliente, mensaje, estrellas)
             VALUES (?,?,?,?)`,
            [id_galeria, id_cliente, mensaje, estrellas]
        );

        res.json({ mensaje: 'Comentario agregado', id_comentario: result.insertId });

    } catch (error) {
        console.error("Error en postComentario:", error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const putComentario = async (req, res) => {
    try {
        const { id } = req.params; // id_comentario
        const { mensaje, estrellas } = req.body;

        const [result] = await conmysql.query(
            `UPDATE Comentarios_Galeria
             SET mensaje = ?, estrellas = ?
             WHERE id_comentario = ?`,
            [mensaje, estrellas, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Comentario no encontrado' });
        }

        const [fila] = await conmysql.query(
            `SELECT * FROM Comentarios_Galeria WHERE id_comentario = ?`,
            [id]
        );

        res.json({
            mensaje: 'Comentario actualizado correctamente',
            data: fila[0]
        });

    } catch (error) {
        console.error("Error en putComentario:", error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const deleteComentario = async (req, res) => {
    try {
        const { id } = req.params; // id_comentario

        const [result] = await conmysql.query(
            `DELETE FROM Comentarios_Galeria WHERE id_comentario = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Comentario no encontrado' });
        }

        res.json({
            estado: 1,
            mensaje: 'Comentario eliminado correctamente'
        });

    } catch (error) {
        console.error("Error en deleteComentario:", error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};
