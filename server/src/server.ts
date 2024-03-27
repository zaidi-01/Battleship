import { webSocketController } from "@controllers";
import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

// TODO: Improve the path to the dist folder
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.get("/assets/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public", req.url));
});

const http = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

http.on("upgrade", webSocketController.handleUpgrade);
