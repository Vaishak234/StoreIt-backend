import UserModel from "../models/userModel.js"


// service for find user by field
export const findUserByField = async(field , value) =>{
    try {
        const query = {};
        query[field] = value;
        
        return await UserModel.findOne(query)
    } catch (error) {
        throw error
    }
}

// service for creating user 
export const createUser = async(userData)=>{
    try {

        return UserModel.create(userData)
    } catch (error) {
        throw error
    }
}