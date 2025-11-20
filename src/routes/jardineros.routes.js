import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getJardineros, getJardineroById, postJardinero, getEstadisticaTrabajos, putJardinero, deleteJardinero,getJardineroTelefono,getJardinerosByIdLoginJard } from '../controladores/jardiCo.js';

const router = Router();

router.get('/jardineros', verifyToken, getJardineros);
router.get('/jardineros/:id', verifyToken, getJardineroById);
router.get('/JardinerosID/:id', verifyToken, getJardinerosByIdLoginJard);
router.post('/jardineros', postJardinero);
router.put('/jardineros/:id', verifyToken, putJardinero);
router.delete('/jardineros/:id', verifyToken, deleteJardinero);
router.get('/jardinerosTelf/:telefono', getJardineroTelefono);
router.get('/jardineros/estadisticas/:id', verifyToken, getEstadisticaTrabajos)

export default router;
