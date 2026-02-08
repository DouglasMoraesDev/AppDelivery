import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Criar pasta de uploads se não existir
// Usar caminho relativo ao workspace
const uploadsDir = path.resolve(path.join(__dirname, '..', '..', '..', 'public', 'uploads'));
console.log('📁 Uploads directory path:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta de uploads criada:', uploadsDir);
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Salvar em public/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// Filtro de arquivos - apenas imagens
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('🔍 Multer fileFilter chamado:');
  console.log('   Field name:', file.fieldname);
  console.log('   Original name:', file.originalname);
  console.log('   MIME type:', file.mimetype);
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('   ✅ Tipo de arquivo permitido');
    cb(null, true);
  } else {
    console.log('   ❌ Tipo de arquivo não permitido');
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'));
  }
};

// Configuração do multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: fileFilter,
});

// Middleware para upload de imagem única
export const uploadSingle = upload.single('image');

// Função para obter URL da imagem salva
export const getImageUrl = (filename: string | null | undefined): string | null => {
  if (!filename) return null;
  return `/uploads/${filename}`;
};

// Função para deletar arquivo
export const deleteImageFile = (filename: string | null | undefined): void => {
  if (!filename) return;
  try {
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log('🗑️ Arquivo deletado:', filename);
    }
  } catch (error) {
    console.error('⚠️ Erro ao deletar arquivo:', error);
  }
};
