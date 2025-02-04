import { authenticator } from 'otplib'


const generateOtp = () => {

    authenticator.options = {
         step: 6000, // OTP will be valid for 3 minutes
         window: 1, // Allow for 1 time window for slight time drift (1 minute before/after valid OTP)
    }
    const otp = authenticator.generate(process.env.OTPLIB_SECRET_KEY); 
  
    return otp

}

export default generateOtp 