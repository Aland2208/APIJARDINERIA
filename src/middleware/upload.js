import multer from 'multer'
import { storage } from '../cloudinary.js'

// Conectamos multer a Cloudinary
const upload = multer({ storage })

export default upload