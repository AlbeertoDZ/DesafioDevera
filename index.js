const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});