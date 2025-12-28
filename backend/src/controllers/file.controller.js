const { File, Task, User } = require("../models");

// POST /api/files
const uploadFile = async (req, res) => {
  const { taskId } = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }
    if (!taskId) {
      return res.status(400).json({ message: "Se requiere ID de tarea" });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const url = `/uploads/${req.file.filename}`;

    const file = await File.create({
      filename: req.file.originalname,
      url: url,
      taskId,
      uploadedBy: req.user.id,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/files/:taskId
const getFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { taskId: req.params.taskId },
      include: [{ model: User, as: "uploader", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};
