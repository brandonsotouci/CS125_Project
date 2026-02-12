import express from "express";
import cors from "cors";
import lastfmRouter from "./routes/lastfm.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/lastfm", lastfmRouter);

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
