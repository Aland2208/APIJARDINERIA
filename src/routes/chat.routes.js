import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getChats, postMensaje } from '../controladores/chatMen.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/chats', verifyToken, getChats);
router.post('/mensajes', verifyToken, upload.single('imagen'), postMensaje);

export default router;
