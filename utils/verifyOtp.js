import { authenticator } from 'otplib'
import dotenv from 'dotenv'

dotenv.config()

const verifyOtp = ({otp}) => {

   const isValid = authenticator.verify({
     token: otp, // OTP received from user or generated
     secret: process.env.OTPLIB_SECRET_KEY, // Secret key to compare
   });
    
    return isValid
}

export default verifyOtp 