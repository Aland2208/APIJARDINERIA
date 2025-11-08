import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getClientes, getClienteById, postCliente, putCliente, deleteCliente } from '../controladores/clientesCo.js';

const router = Router();

router.get('/clientes', verifyToken, getClientes);
router.get('/clientes/:id', verifyToken, getClienteById);
router.post('/clientes', verifyToken, postCliente);
router.put('/clientes/:id', verifyToken, putCliente);
router.delete('/clientes/:id', verifyToken, deleteCliente);

export default router;
