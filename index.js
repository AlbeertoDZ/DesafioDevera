const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3001;

require('dotenv').config();// Cargar variables de entorno

app.use(express.json());

app.use(express.static("public")); // Middleware para servir archivos estáticos de front

// Servir archivos generados por Vite en /client/dist
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});