import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

export const getClientes = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Clientes');
        res.json({ cantidad: result.length, data: result });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const getClienteById = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Clientes WHERE id_cliente = ?', [req.params.id]);
        if (result.length <= 0) return res.json({ cantidad: 0, mensaje: 'Cliente no encontrado' });
        res.json({ cantidad: result.length, data: result[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const postCliente = async (req, res) => {
    try {
        const { nombre_completo, email, telefono, direccion, username, password } = req.body;

        // Validación simple
        if (!nombre_completo || !email || !telefono || !direccion || !username || !password) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }

        // Verificar si el email o username ya existen
        const [existeEmail] = await conmysql.query('SELECT 1 FROM Clientes WHERE email = ?', [email]);
        const [existeUser] = await conmysql.query('SELECT 1 FROM Login_Clientes WHERE username = ?', [username]);

        if (existeEmail.length > 0) return res.status(409).json({ mensaje: 'Email ya registrado' });
        if (existeUser.length > 0) return res.status(409).json({ mensaje: 'Usuario ya existe' });

        // Insertar cliente
        const [insertCliente] = await conmysql.query(
            'INSERT INTO Clientes(nombre_completo, email, telefono, direccion) VALUES (?,?,?,?)',
            [nombre_completo, email, telefono, direccion]
        );

        const id_cliente = insertCliente.insertId;
        const hash = crypto.createHash('md5').update(password).digest('hex');

        await conmysql.query(
            'INSERT INTO Login_Clientes(id_cliente, username, password_hash) VALUES (?,?,?)',
            [id_cliente, username, hash]
        );

        res.status(201).json({ mensaje: 'Cliente registrado exitosamente', id_cliente });
    } catch (error) {
        console.error('Error en postCliente:', error); // VER logs completos en Render
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const putCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, email, telefono, direccion } = req.body;
        const [result] = await conmysql.query(
            'UPDATE Clientes SET nombre_completo=?, email=?, telefono=?, direccion=? WHERE id_cliente=?',
            [nombre_completo, email, telefono, direccion, id]
        );
        if (result.affectedRows <= 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        const [fila] = await conmysql.query('SELECT * FROM Clientes WHERE id_cliente=?', [id]);
        res.json(fila[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};

export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM Clientes WHERE id_cliente=?', [id]);
        if (result.affectedRows <= 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Internal server error' });
    }
};