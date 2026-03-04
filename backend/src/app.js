import express from "express";
import cors from "cors";
import lastfmRouter from "./routes/lastfm.js";
import postgresRouter from "./routes/postgres.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { pool } from "./utils/db.js";
import jwt from "jsonwebtoken"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed)

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hashed]
    )

    res.status(201).json({ message: "User Created!"});
  } catch (err){
    res.status(400).json({ error: err.message })
  }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );

    if (result.rows.length === 0){
      return res.status(401).json({ error: "Invalid credentials!"})
    }

    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid){
      return res.status(401).json({ error: "Invalid credentials!"})
    }

    const token = jwt.sign({userId: user.id}, JWT_SECRET, { expiresIn: "1h"});
    console.log('signed in')

    res.json({ token });
})

app.use("/api/lastfm", lastfmRouter);
app.use("/api/postgres", postgresRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err?.response?.status || 500;
  const message =
    err?.response?.data?.message ||
    err?.message ||
    "Internal Server Error";
  res.status(status).json({ error: message });
});

export default app;
