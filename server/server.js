import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";


import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT
connectDB()

const allowedOrigins = ['http://localhost:5173','https://secure-auth-bai80iu4x-maniarasan2k2ks-projects.vercel.app'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}))

// Api Endpoints 

app.get("/",(req,res)=>{
    res.send("Api Working")
})
app.use('/api/auth',authRouter )
app.use('/api/user',userRouter )


app.listen(port, ()=>{console.log(`Start on the port is ${port}`)})
