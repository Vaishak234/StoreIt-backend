import multer, { memoryStorage } from 'multer'


const storage =  memoryStorage()

const uploadFile = multer({ storage });


export default uploadFile