import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'email required'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
      
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    storageUsed:{
        type:Number,
        default:0
    }

}, { timestamps: true })

const UserModel = mongoose.model("User", userSchema)

export default UserModel
