import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getGaleria = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Galeria');
        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postGaleria = async (req, res) => {
    try {
        const { id_jardinero, id_cliente, titulo, descripcion, tipo } = req.body;

        // 📤 Cloudinary ya subió la imagen
        const url_foto = req.file ? req.file.path : null;

        if (!url_foto) {
            return res.status(400).json({ mensaje: 'Debe subir una imagen' });
        }

        const [result] = await conmysql.query(
            'INSERT INTO Galeria(id_jardinero, id_cliente, titulo, descripcion, tipo, url_foto) VALUES (?,?,?,?,?,?)',
            [id_jardinero, id_cliente, titulo, descripcion, tipo, url_foto]
        );

        res.json({ mensaje: 'Foto subida correctamente', id_galeria: result.insertId, url_foto });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};


export const postComentario = async (req, res) => {
    try {
        const { id_galeria, id_cliente, mensaje, estrellas } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO Comentarios_Galeria(id_galeria, id_cliente, mensaje, estrellas) VALUES (?,?,?,?)',
            [id_galeria, id_cliente, mensaje, estrellas]
        );
        res.json({ mensaje: 'Comentario agregado', id_comentario: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};