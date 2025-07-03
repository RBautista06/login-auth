import express from "express";
import { dbConnection } from "./db/connection.js";
import authRoutes from "../server/routes/auth-route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
// This line allows your backend (e.g., on port 5000) to accept requests
// from your frontend (running on http://localhost:5173, like in Vite)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Only allow requests from this origin (your frontend)
    credentials: true, // ✅ Allow cookies (like JWT) to be sent with the request
  })
);
app.use(express.json()); //for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use("/api/auth", authRoutes); // the routes in the authRourt will be accessed with the prefix of /api/auth

app.get("/", (req, res) => {
  res.send("Hello bitches");
});

dbConnection();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
