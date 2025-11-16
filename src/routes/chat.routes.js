import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getChats, postMensaje,getMensajesByChat,crearChat,getMensajesByCliente,getMensajesByJardinero } from '../controladores/chatMen.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/chats', verifyToken, getChats);
router.post('/mensajes', verifyToken, upload.single('imagen'), postMensaje);
router.post('/chats', verifyToken, crearChat);
router.get('/mensajes/cliente/:id_cliente', verifyToken, getMensajesByCliente);
router.get('/mensajes/jardineros/:id_cliente', verifyToken, getMensajesByJardinero);
router.get('/mensajes/:id_chat', verifyToken, getMensajesByChat);
export default router;
