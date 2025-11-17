import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    postAgenda, postVerificacion, postNotificacion, getVerificaciones, validarAgenda, getAgendaPorCita, updateAgendaPorCita, getNotificacionesPorJardinero, getEnviosPorCliente,
    getEnviosPorJardinero,
    postEnvio,
    deleteEnvio
} from '../controladores/agenVeriNoti.js';
import { permitirRol } from '../middleware/roles.js';

const router = Router();

router.post('/agenda', verifyToken, postAgenda);
router.post('/verificaciones', verifyToken, permitirRol('jardinero'), postVerificacion);
router.get('/verificaciones', verifyToken, permitirRol('jardinero'), getVerificaciones);
router.post('/notificaciones', verifyToken, postNotificacion);
router.post('/agenda/validar', verifyToken, permitirRol('jardinero'), validarAgenda);
router.get('/agenda/cita/:id_cita', verifyToken, getAgendaPorCita);
router.get('/notificaciones/jardinero/:id_jardinero', verifyToken, getNotificacionesPorJardinero);
router.put('/agendaAC/cita/:id_cita', updateAgendaPorCita);
router.get('/Envio/:id_cliente', getEnviosPorCliente);
router.get('/EnvioJar/:id_jardinero', getEnviosPorJardinero);
router.post('/Envio', postEnvio);
router.delete('/Envio/:id_notificacion', deleteEnvio);
export default router;
