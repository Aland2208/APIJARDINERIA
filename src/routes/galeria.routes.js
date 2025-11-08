import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getGaleria, postGaleria, postComentario } from '../controladores/galeriaComentario.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/galeria', verifyToken, getGaleria);
router.post('/galeria', verifyToken, upload.single('imagen'), postGaleria);
router.post('/galeria/comentarios', verifyToken, postComentario);

export default router;
