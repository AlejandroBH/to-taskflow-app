const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "La conexión a la base de datos se ha establecido correctamente."
    );
  } catch (error) {
    console.error("No se puede conectar a la base de datos:", error);
  }
};

module.exports = { sequelize, connectDB };
