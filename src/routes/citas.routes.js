import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getCitas, postCita,getCitasPorCliente,cancelarCita,actualizarCita   } from '../controladores/citasCo.js';
import { permitirRol } from '../middleware/roles.js';

const router = Router();

router.get('/citas', verifyToken, getCitas);
router.post('/citas', verifyToken, permitirRol('cliente'), postCita);
router.get('/citas/cliente/:id_cliente', getCitasPorCliente);
router.put('/citas/:id_cita/cancelar', verifyToken, permitirRol('cliente'), cancelarCita);
router.put('/citas/:id_cita', actualizarCita);

export default router;

