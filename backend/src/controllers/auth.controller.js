const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor agregue todos los campos" });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario no válidos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Credenciales no válidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage,
    };
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
