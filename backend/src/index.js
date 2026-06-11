import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
import leaveRouter from "./routes/leave.routes.js"
import oncallRouter from "./routes/oncall.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ status: "Ok" })
})

app.use("/api/users", userRouter)

app.use("/api/leaves", leaveRouter)

app.use("/api/oncalls", oncallRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
