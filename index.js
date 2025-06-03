const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

require("dotenv").config(); // Cargar variables de entorno

//Habilitar CORS
app.use(cors());

// Para poder leer JSON en las peticiones
app.use(express.json());

// Para poder leer form-data y URL-encoded data
app.use(express.urlencoded({ extended: true }));

//RUTAS API (deben ir antes del middleware de archivos estáticos)
const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);  

// RUTAS DE ARCHIVOS
const filesRoutes = require("./routes/files.routes");
app.use("/api", filesRoutes);

// Middleware para servir archivos estáticos de front
app.use(express.static("public"));

// Servir archivos generados por Vite en /client/dist
app.use(express.static(path.join(__dirname, "client", "dist")));

// Catch-all handler: envía el frontend para todas las rutas que no sean API
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

//Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});