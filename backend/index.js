import express from "express"
import mongoose from "mongoose"
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import listingRouter from './routes/listing.route.js'
import gmailRouter from './routes/gmail.route.js'
import dotenv from 'dotenv'
dotenv.config();


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database")
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)
app.use('/api/mail',gmailRouter) // ****** IGNORE THIS ROUTE **************** ////////////////////////////
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal serveer issue";
    res.status(statusCode).send({
        success:false,
        message,
        statusCode
    })
})
app.listen(process.env.PORT,()=>{
    console.log("app is listenimg at port "+process.env.PORT)
})