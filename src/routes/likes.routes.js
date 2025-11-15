import { Router } from 'express';
import { darLike, quitarLike, contarLikes, verificarLike } from '../controladores/likesCo.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();


router.post('/like', verifyToken, darLike);
router.post('/unlike', verifyToken, quitarLike);
router.get('/likes/:id_galeria', verifyToken, contarLikes);
router.post('/like/verificar', verifyToken, verificarLike);

export default router;
