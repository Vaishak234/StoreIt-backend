import express from 'express';
import { createPresignedUrlController, deleteFileController, fileUploadController, getFilesController, getFilesSpace, renameFileController } from '../controllers/fileController.js';
import verifyAuthToken from '../middlewares/verifyAuthentication.js';
import uploadFile from '../middlewares/multer.js';
import { rename } from 'fs';

const router = express.Router();


router.use(verifyAuthToken)

router.post('/generate-url',uploadFile.array('files'),createPresignedUrlController)

router.post('/upload',fileUploadController)

router.get('/',getFilesController)

router.get('/usage-space', getFilesSpace)

router.delete('/:id/:size',deleteFileController)

router.put('/:id', renameFileController)




export default router