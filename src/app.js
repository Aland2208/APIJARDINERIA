import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Importar rutas
import loginRoutes from './routes/login.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import jardinerosRoutes from './routes/jardineros.routes.js';
import tiposTrabajoRoutes from './routes/tipotrabajo.routes.js';
import citasRoutes from './routes/citas.routes.js';
import galeriaRoutes from './routes/galeria.routes.js';
import chatRoutes from './routes/chat.routes.js';
import agendaVeriNotiRoutes from './routes/agendaVeriNoti.routes.js';
import megustasRoutes from './routes/likes.routes.js';

// ✅ Corrección de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:8100', 'https://apijardineria.onrender.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());


// ✅ Servir archivos estáticos (si más adelante subes imágenes locales)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Prefijo /api para todas las rutas
app.use('/api', loginRoutes);
app.use('/api', clientesRoutes);
app.use('/api', jardinerosRoutes);
app.use('/api', tiposTrabajoRoutes);
app.use('/api', citasRoutes);
app.use('/api', galeriaRoutes);
app.use('/api', chatRoutes);
app.use('/api', agendaVeriNotiRoutes);
app.use('/api', megustasRoutes);

// ✅ Ruta por defecto (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Endpoint no encontrado' });
});

export default app;
