import express from "express";

const server = express();

server.get("/", (req, res) => {
  res.send({ msg: "Ciao Giulia" });
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log("🚀 Server is up at http://localhost:4000");
});
