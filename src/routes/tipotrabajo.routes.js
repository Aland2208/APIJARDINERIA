import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getTiposTrabajo, postTipoTrabajo } from '../controladores/tipodetCo.js';

const router = Router();

router.get('/tipos_trabajo', verifyToken, getTiposTrabajo);
router.post('/tipos_trabajo', verifyToken, postTipoTrabajo);

export default router;
