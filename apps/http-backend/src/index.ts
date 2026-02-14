import express from "express";
import authRoutes from "./authRoutes";
import roomRoutes from "./roomRoutes";
import moveRoutes from "./moveRoutes"

const app = express();

app.use(express.json());
app.use("/auth",authRoutes);
app.use("/room",roomRoutes);
app.use("/moves",moveRoutes);

app.listen(3001);
