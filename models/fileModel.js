import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:true
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    extension: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{timestamps:true});

const FileModel = mongoose.model('File', fileSchema);

export default FileModel;