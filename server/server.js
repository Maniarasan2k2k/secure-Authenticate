import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://authenticate-mnau-ef3m6jh1h-maniarasan2k2ks-projects.vercel.app"
];

app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS setup
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ API Endpoints
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
