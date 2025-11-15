import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getClientes, getClienteById, postCliente, putCliente, deleteCliente, getClienteByIdLoginCli} from '../controladores/clientesCo.js';

const router = Router();

router.get('/clientes', verifyToken, getClientes);
router.get('/clientes/:id', verifyToken, getClienteById);
router.get('/clientesID/:id', verifyToken, getClienteByIdLoginCli);
router.post('/clientes', postCliente);
router.put('/clientes/:id', verifyToken, putCliente);
router.delete('/clientes/:id', verifyToken, deleteCliente);

export default router;
