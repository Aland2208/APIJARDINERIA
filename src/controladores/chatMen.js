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

export const crearChat = async (req, res) => {
    try {
        const { id_cita } = req.body;

        const cita = null;

        const [result] = await conmysql.query(
            "INSERT INTO Chats(id_cita, creado_en) VALUES (?, NOW())",
            [cita]
        );

        res.json({
            mensaje: "Chat creado correctamente",
            id_chat: result.insertId
        });

    } catch (error) {
        console.error("Error al crear chat:", error);
        res.status(500).json({ mensaje: "Internal server error" });
    }
};
export const getMensajesByChat = async (req, res) => {
    try {
        const { id_chat } = req.params;

        const [result] = await conmysql.query(
            "SELECT * FROM Mensajes WHERE id_chat = ? ORDER BY fecha ASC",
            [id_chat]
        );

        res.json({
            cantidad: result.length,
            data: result
        });

    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ mensaje: "Internal server error" });
    }
};

export const postMensaje = async (req, res) => {
    try {
        const { id_chat, id_emisor_jardinero, id_emisor_cliente, mensaje } = req.body;
        const url_imagen = req.file ? req.file.path : null;

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
export const getMensajesByCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;

        if (!id_cliente) {
            return res.status(400).json({ mensaje: "Falta el parámetro id_cliente" });
        }

        const [mensajes] = await conmysql.query(
            "SELECT * FROM Mensajes WHERE id_emisor_cliente = ? ORDER BY fecha ASC",
            [id_cliente]
        );

        if (mensajes.length === 0) {
            return res.json({
                mensaje: "El cliente no tiene mensajes enviados",
                cantidad: 0,
                data: []
            });
        }

        const idChats = [...new Set(mensajes.map(m => m.id_chat))];

        const [chats] = await conmysql.query(
            `SELECT * FROM Chats WHERE id_chat IN (${idChats.map(() => "?").join(",")})`,
            idChats
        );

        const data = chats.map(chat => ({
            chat,
            mensajes: mensajes.filter(m => m.id_chat === chat.id_chat)
        }));

        res.json({
            mensaje: "Datos recuperados",
            cantidad: data.length,
            data
        });

    } catch (error) {
        console.error("Error al obtener mensajes del cliente:", error);
        res.status(500).json({ mensaje: "Internal server error" });
    }
};

