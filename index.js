const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config(); // Cargar variables de entorno

//Habilitar CORS
app.use(cors());

// Para poder leer JSON en las peticiones
app.use(express.json());

//RUTAS
const usersRoutes = require("./routes/users.routes");

//Rutas API
app.use("/api/users", usersRoutes);  

//Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});