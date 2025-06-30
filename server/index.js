import express from "express";
import { dbConnection } from "./db/connection.js";
import authRoutes from "../server/routes/auth-route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes); // the routes in the authRourt will be accessed with the prefix of /api/auth

app.get("/", (req, res) => {
  res.send("Hello bitches");
});

dbConnection();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});
