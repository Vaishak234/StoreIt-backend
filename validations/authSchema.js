import Joi from 'joi';

export const userSignupSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
});

export const userSignInSchema = Joi.object({
    email: Joi.string().email().required(),
});


export const otpVerifySchema = Joi.object({
   email: Joi.string().email().required(),
   otp: Joi.string().length(6).required() 
});


