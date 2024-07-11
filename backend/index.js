import express from "express";
import mongoose from "mongoose";
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import gmailRouter from './routes/gmail.route.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to database");
});

// This is needed to resolve __dirname in ES6 modules
const __dirname = path.resolve();

// Serve static files from the React app


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/mail', gmailRouter); // ****** IGNORE THIS ROUTE **************** ////////////////////////////

app.use(express.static(path.join(__dirname, '/frontend/dist')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend','dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server issue";
    res.status(statusCode).send({
        success: false,
        message,
        statusCode
    });
});

app.listen(process.env.PORT, () => {
    console.log("App is listening at port " + process.env.PORT);
});
