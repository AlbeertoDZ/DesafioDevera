const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

require("dotenv").config(); // Cargar variables de entorno

//Habilitar CORS
app.use(cors());

// Para poder leer JSON en las peticiones
app.use(express.json());

// Middleware para servir archivos estáticos de front
app.use(express.static("public"));

// Servir archivos generados por Vite en /client/dist
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });

//RUTAS
const usersRoutes = require("./routes/users.routes");

//Rutas API
app.use("/api/users", usersRoutes);  

//Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});