const { Comment, Task, User } = require("../models");

// POST /api/comments
const addComment = async (req, res) => {
  const { content, taskId } = req.body;

  try {
    if (!content || !taskId) {
      return res
        .status(400)
        .json({
          message: "Se requieren el contenido y la identificación de la tarea",
        });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const comment = await Comment.create({
      content,
      taskId,
      userId: req.user.id,
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/comments/:taskId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { taskId: req.params.taskId },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  addComment,
  getComments,
};
