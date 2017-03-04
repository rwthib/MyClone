const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);


io.on("connection", () => {
  console.log("new connection");
});


app.get("/", (req, res) => {
  res.send("Hello World!");
  io.emit("alert","Someone requested root!");
});

app.post("/action", (req, res) => {
  res.send("Hello World!");
  io.emit("alert","Someone requested an action!");
});

app.get("/client", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Example app listening on port 3000!");
});
