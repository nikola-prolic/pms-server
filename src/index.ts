import express from "express";
import router from "./routes/router";
import cors from "cors";

const app = express();
const port = process.env.PORT

app.get("/", (_req, res) => {
  res.send("Howdy hey, TypeScript with Express!");
});

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
