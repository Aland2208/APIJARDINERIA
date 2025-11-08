import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getJardineros, getJardineroById, postJardinero, putJardinero, deleteJardinero } from '../controladores/jardiCo.js';

const router = Router();

router.get('/jardineros', verifyToken, getJardineros);
router.get('/jardineros/:id', verifyToken, getJardineroById);
router.post('/jardineros', verifyToken, postJardinero);
router.put('/jardineros/:id', verifyToken, putJardinero);
router.delete('/jardineros/:id', verifyToken, deleteJardinero);

export default router;
