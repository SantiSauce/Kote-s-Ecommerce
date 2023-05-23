import multer from 'multer'
import path from 'path'
import __dirname from '../dirname.js'


// Define la función para determinar la carpeta de destino según el tipo de archivo
const destinationPath = function (req, file, cb) {
  let destination = __dirname + '/public/documents'; // Carpeta por defecto para documentos

  if (file.fieldname === 'profileImage') {
    destination = __dirname + '/public/profiles'; // Carpeta para imágenes de perfil
  } else if (file.fieldname === 'productImage') {
    destination = __dirname + '/public/products' // Carpeta para imágenes de productos
  }

  cb(null, destination);
};

// Configura el almacenamiento de Multer
const storage = multer.diskStorage({
  destination: destinationPath,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage})
export default upload
// Resto del código de tu archivo de ruta de usuarios
