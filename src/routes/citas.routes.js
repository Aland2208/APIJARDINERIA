import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getCitas, postCita } from '../controladores/citasCo.js';
import { permitirRol } from '../middleware/roles.js';

const router = Router();

router.get('/citas', verifyToken, getCitas);
// Crear cita (solo clientes)
router.post('/citas', verifyToken, permitirRol('cliente'), postCita);

export default router;
