const { Task, Project, User } = require("../models");

// POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, projectId, assignedTo } =
    req.body;

  try {
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Se requieren el título y el ID del proyecto" });
    }

    if (req.user.role === "member") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para crear tareas." });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      projectId,
      assignedTo,
      status: "pending",
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/tasks
const getTasks = async (req, res) => {
  const { projectId } = req.query;

  try {
    let where = {};
    if (projectId) {
      where.projectId = projectId;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (req.user.role === "member") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para actualizar tareas." });
    }

    const updatedTask = await task.update(req.body);
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (req.user.role === "member") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar tareas." });
    }

    await task.destroy();
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
