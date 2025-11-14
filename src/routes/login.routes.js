import { Router } from 'express';
import { login, verificarUsuarioCorreo } from '../controladores/loginC.js';

const router = Router();

router.post('/login', login);
router.post('/verificar', verificarUsuarioCorreo)

export default router;
