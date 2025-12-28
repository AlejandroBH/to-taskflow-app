const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/metrics", require("./routes/metric.routes"));

// Conexión y Sincronización de Base de Datos
const { connectDB, sequelize } = require("./config/database");
const { User, Project, Task, Comment, File } = require("./models");

connectDB().then(() => {
  sequelize
    .sync({ force: false })
    .then(() => console.log("Database synced"))
    .catch((err) => console.error("Error syncing database:", err));
});

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/comments", require("./routes/comment.routes"));
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/users", require("./routes/user.routes"));

// Servir archivos subidos
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ruta Básica
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de TaskFlow" });
});

module.exports = app;
