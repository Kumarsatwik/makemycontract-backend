import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/passport";
import serverless from "serverless-http";
// routes
import authRoutes from "./routes/auth";
import contractRoute from "./routes/contracts";
import paymentRoutes from "./routes/payments";
import path from "path";

import connectDB from "./config/mongodb";
import { handleWebhook } from "./controllers/payment.controller";
dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(morgan("dev"));

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")))

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI!,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contracts", contractRoute);
app.use("/api/payments", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// export const handler = serverless(app);
