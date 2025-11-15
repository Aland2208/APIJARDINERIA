import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getCitas, postCita,getCitasPorCliente } from '../controladores/citasCo.js';
import { permitirRol } from '../middleware/roles.js';

const router = Router();

router.get('/citas', verifyToken, getCitas);
router.post('/citas', verifyToken, permitirRol('cliente'), postCita);
router.get('/citas/cliente/:id_cliente', getCitasPorCliente);
export default router;
