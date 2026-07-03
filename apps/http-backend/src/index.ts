import express from "express";
import authRoutes from "./authRoutes";
import roomRoutes from "./roomRoutes";
import moveRoutes from "./moveRoutes"
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth",authRoutes);
app.use("/room",roomRoutes);
app.use("/moves",moveRoutes);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
