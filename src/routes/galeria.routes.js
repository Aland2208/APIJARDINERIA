import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getGaleria, getGaleriaById, postGaleriaJardinero, deleteGaleria, getComentario, postComentario, putComentario, deleteComentario } from '../controladores/galeriaComentario.js';
import upload from '../middleware/upload.js';

const router = Router();

// GALERÍA

router.get('/galeria', verifyToken, getGaleria);
router.get('/galeria/:id', verifyToken, getGaleriaById);
router.post('/galeria', verifyToken, upload.single('imagen'), postGaleriaJardinero);
router.delete('/galeria/:id', verifyToken, deleteGaleria);

//COMENTARIOS GALERÍA

router.get('/galeria/comentarios/comentario/:id', verifyToken, getComentario);
router.post('/galeria/comentarios', verifyToken, postComentario);
router.put('/galeria/comentarios/:id', verifyToken, putComentario);
router.delete('/galeria/comentarios/:id', verifyToken, deleteComentario);

export default router;
