import express from "express";
import cors from "cors";

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ status: "Ok" })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
