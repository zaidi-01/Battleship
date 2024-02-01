import path from "path";
import express from "express";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
