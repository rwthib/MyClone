const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.use('/css',express.static(path.join(__dirname, 'login/css')));

io.on("connection", socket => {
  console.log("new connection from "+socket.id);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login/index.html"));
  console.log("Login page accessed");
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
  console.log("Privacy policy accessed");
});

app.post("/action", (req, res) => {
  let action = req.body.action;
  console.log("action received: "+ action);
  if (action) { 
    io.emit("action", action);

    res.status(200).send("{\"message\": \"action '"+action+"' sent\" }");
  }
  else {
    res.status(400).send("{\"message\": \"no action specified.\" }");
  }
});

app.get("/client", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Example app listening on port 3000!");
});
