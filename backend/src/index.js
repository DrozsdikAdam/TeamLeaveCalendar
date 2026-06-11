import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ status: "Ok" })
})

app.use("/api/users", userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
