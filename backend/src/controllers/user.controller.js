const { User } = require("../models");

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "member",
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// POST /api/users/profile/avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const url = `/uploads/${req.file.filename}`;
    user.profileImage = url;
    await user.save();

    res.json({
      url: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};
