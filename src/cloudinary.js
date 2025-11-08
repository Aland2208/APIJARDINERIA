import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables del archivo .env
dotenv.config();

// 🔧 Configuración de Cloudinary con tus credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🗂️ Configurar almacenamiento con Multer-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productos', // Carpeta principal en tu cuenta de Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => {
      // Generar nombre único para evitar duplicados
      const nombreSinExt = path.parse(file.originalname).name;
      return `${Date.now()}-${nombreSinExt}`;
    }
  }
});

export { cloudinary, storage };
