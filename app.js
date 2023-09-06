import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuración de multer para gestionar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const fileExt = extname(file.originalname);
    const filename = `${file.originalname}${Date.now()}${fileExt}`;
    cb(null, filename); // Nombre de archivo único basado en la marca de tiempo
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Límite de 3 MB para el tamaño del archivo
});

// Ruta GET que devuelve el formulario HTML para cargar una imagen
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/upload.html');
});

// Ruta POST para recibir y guardar la imagen
app.post('/upload', upload.single('imagen'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Debes seleccionar una imagen para cargar.');
  }

  // Aquí puedes realizar acciones adicionales con la imagen, como almacenar información en una base de datos.

  res.status(200).send('Imagen cargada con éxito.');
  console.log('Imagen agregada a la carpeta images');
});

// Carpeta estática para servir imágenes cargadas
app.use('/images', express.static('public/images'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
