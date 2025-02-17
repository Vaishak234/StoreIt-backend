import asyncHandler from 'express-async-handler';
import { otpVerifySchema, userSignInSchema, userSignupSchema } from '../validations/authSchema.js';
import generateOtp from '../utils/generateOtp.js';
import { sendEmail } from '../config/sendEmail.js';
import verifyOtp from '../utils/verifyOtp.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import jwt from 'jsonwebtoken'
import { createUser, findUserByField } from '../services/userServices.js';
import { authCookieOptions } from '../utils/cookieOptions.js';


// helper function to create a data objset
//  that send to frontend in a specific formate
const createUserData = (user, accessToken) => {
    return {
        fullName: user.fullName,
        email: user.email,
        storageLimit:user.storageLimit,
        storageUsed:user.storageUsed,
        accessToken,
    };
};


export const signupController = asyncHandler(async (req, res) => {

    // validating the data using joi validation
    const { error } = userSignupSchema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message, success: false })

    const { fullName, email } = req.body;

    const userExist = await findUserByField('email', email)

    if (userExist) return res.status(400).json({ message: "User with email already exist", success: false })

    await createUser({ fullName, email })

    const otp = generateOtp()

    await sendEmail({
        to: email,
        subject: "User Verification",
        html: `<div>
              <p> your otp is ${otp}</p>
              <p>otp is valid for 5 minutes</p>
        </div>`,
    })

    res.status(201).json({ message: 'Otp send successfully', data: otp, success: true });
});


export const signInController = asyncHandler(async (req, res) => {

    const { error } = userSignInSchema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message, success: false })

    const { email } = req.body;

    const userExist = await findUserByField('email', email)

    if (!userExist) return res.status(400).json({ message: "User not registered with this email", success: false })

    const otp = generateOtp()


    await sendEmail({
        to: email,
        subject: "User Verification",
        html: `
        <div>
             <p> your otp is ${otp}</p>
             <p> your otp is only valid for 6 minutes</p>
        </div >`,
    })

    res.status(201).json({ message: 'Otp send successfully', data: otp, success: true });

})



export const verifyRegistrationOtp = asyncHandler(async (req, res) => {

    // validating the otp using joi validation
    const { error } = otpVerifySchema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message, success: false })

    const { email, otp } = req.body

    const isValid = verifyOtp({ otp })
    if (!isValid) return res.status(400).json({ message: "invalid otp", error: true })

    const userExist = await findUserByField('email', email)

    if (!userExist) return res.status(400).json({ message: "User not registered with this email", success: false })


    const accessToken = await generateAccessToken(userExist._id)


    res.cookie('jwt', accessToken, authCookieOptions)
        .status(200)
        .json(
            {
                message: "otp verified succesuflly",
                data: createUserData(userExist, accessToken),
                success: true
            }
        )

})


export const logoutUser = asyncHandler(async (req, res) => {


    res.clearCookie("jwt", authCookieOptions)
        .json({ message: 'logout successfully', success: true })
})


export const refreshUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(400).json({ message: 'unauthorized access', error: true })

    const accesToken = cookies.jwt

    jwt.verify(accesToken, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
        if (decoded) {
            const userExist = await findUserByField('_id', decoded.id)

            if (!userExist) return res.status(400).json({ message: 'user is not authorized', error: true })

            const accessToken = await generateAccessToken(userExist._id)

            res.status(200).json(
                {
                    message: "successfully fetched user",
                    success: true,
                    data: createUserData(userExist, accessToken)
                }
            )
        } else {
            return res.status(400).json({ message: 'token expired expired', error: true })
        }
    })
})