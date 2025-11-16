import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { postAgenda, postVerificacion, postNotificacion, getVerificaciones,validarAgenda,getAgendaPorCita,updateAgendaPorCita} from '../controladores/agenVeriNoti.js';
import { permitirRol } from '../middleware/roles.js';

const router = Router();

router.post('/agenda', verifyToken, postAgenda);
router.post('/verificaciones', verifyToken, permitirRol('jardinero'), postVerificacion);
router.get('/verificaciones', verifyToken, permitirRol('jardinero'), getVerificaciones);
router.post('/notificaciones', verifyToken, postNotificacion);
router.post('/agenda/validar', verifyToken, permitirRol('jardinero'), validarAgenda);
router.get('/agenda/cita/:id_cita', verifyToken, getAgendaPorCita);
router.put('/agendaAC/cita/:id_cita', updateAgendaPorCita);

export default router;
