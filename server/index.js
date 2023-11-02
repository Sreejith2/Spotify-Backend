import dotenv from "dotenv";
import express from "express";
import connection from "./db.js";
import "express-async-errors";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";
import playlistRoutes from "./routes/playlist.js";
import searchRoutes from "./routes/search.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/login",authRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/playlists",playlistRoutes);
app.use("/api/",searchRoutes);

connection();
const port=process.env.PORT||8080;
app.listen(port,console.log(`Listening on port ${port}`));