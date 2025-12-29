const { Project, User } = require("../models");

// POST /api/projects
const createProject = async (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre del proyecto es obligatorio." });
    }

    const project = await Project.create({
      name,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      managerId: req.user.id,
      status: "active",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: "manager", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: "manager", attributes: ["id", "name", "email"] },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.managerId !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "Usuario no autorizado" });
    }

    const updatedProject = await project.update(req.body);
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.managerId !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "Usuario no autorizado" });
    }

    await project.destroy();
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
