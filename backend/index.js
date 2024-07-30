import express from "express";
import mongoose from "mongoose";
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import restaurantRouter from "./routes/restaurant.route.js"
import gmailRouter from './routes/gmail.route.js';
import path from 'path';
import dotenv from 'dotenv';
import foodRouter from './routes/food.route.js';
import cartRouter from './routes/cart.route.js';
import Stripe from "stripe";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to database");
});
const __dirname = path.resolve();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.foodId.name,
                    images: item.foodId.imageUrls,
                },
                unit_amount: (item.foodId.regularPrice - item.foodId.discountPrice === item.foodId.regularPrice ? item.foodId.regularPrice : item.foodId.discountPrice) * 100, // Stripe expects the amount in cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe checkout session creation error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend','dist', 'index.html'));
  });



// Error handling middleware
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

