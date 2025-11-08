import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getChats = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Chats');
        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postMensaje = async (req, res) => {
    try {
        const { id_chat, id_emisor_jardinero, id_emisor_cliente, mensaje } = req.body;
        const url_imagen = req.file ? req.file.path : null; // ✅ Cloudinary URL

        const [result] = await conmysql.query(
            'INSERT INTO Mensajes(id_chat, id_emisor_jardinero, id_emisor_cliente, mensaje, url_imagen) VALUES (?,?,?,?,?)',
            [id_chat, id_emisor_jardinero, id_emisor_cliente, mensaje, url_imagen]
        );

        res.json({ mensaje: 'Mensaje enviado', id_mensaje: result.insertId, url_imagen });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};
