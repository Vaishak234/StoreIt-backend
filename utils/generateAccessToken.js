import  jwt from "jsonwebtoken"

const generateAccessToken = async(userId) => {
    
    const accessToken =  jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '15h' })
    
    return accessToken
}

export default generateAccessToken