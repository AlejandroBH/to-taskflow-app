// auth.js - API completa de autenticación
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Registro de usuarios
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("nombre").trim().isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nombre } = req.body;

    try {
      // Verificar si usuario existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: "Email ya registrado" });
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear usuario
      const user = await User.create({
        email,
        password: hashedPassword,
        nombre,
        role: "user",
        activo: true,
      });

      // Generar tokens
      const tokens = generateTokens(user);

      // Guardar refresh token
      await user.update({ refreshToken: tokens.refreshToken });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          role: user.role,
        },
        ...tokens,
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const tokens = generateTokens(user);
  await user.update({ refreshToken: tokens.refreshToken });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    },
    ...tokens,
  });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

  const user = await User.findByPk(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const tokens = generateTokens(user);
  await user.update({ refreshToken: tokens.refreshToken });

  res.json(tokens);
});
