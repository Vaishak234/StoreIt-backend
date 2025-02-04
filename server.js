// third -partyy imports

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fs from 'fs'
import path from'path'

// local imports
import errorHandler from './middlewares/errorHandler.js'
import connectDb from './config/connection.js'


// import route handlers
import authRoute from './routes/authRoute.js'
import fileRoute from './routes/fileRoute.js'

// configuring dotenv file
dotenv.config()


const app = express()

/**
 * The port number on which the server will listen.
 * Defaults to 4000 if process.env.PORT is not defined.
 * 
 */
const PORT = 4000 || process.env.PORT

// cors setting for creoss origin request
app.use(cors({
    origin: process.env.FRONTEND_URL,  // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow the required methods
    credentials: true,  // Allow cookies 
}));


app.use(express.json())

app.use(cookieParser())


// Log requests to the file
app.use(morgan('dev'));


// database connection
connectDb()

// route handlers
app.use('/api/auth', authRoute)
app.use('/api/file', fileRoute)


// error handler middleware
app.use(errorHandler)


app.listen(PORT, () => console.log(`server is running on port : ${PORT}`))