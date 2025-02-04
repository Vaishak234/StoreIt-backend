import FileModel from "../models/fileModel.js"



export const createFile = async (data)=>{
    try {
        let newFile = await FileModel.create(data)

        return newFile
    } catch (error) {
        throw error
    }
}