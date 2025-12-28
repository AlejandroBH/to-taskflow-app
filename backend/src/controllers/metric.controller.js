const { Project, Task, User } = require("../models");

// GET /api/metrics
const getMetrics = async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const activeProjects = await Project.count({ where: { status: "active" } });
    const completedProjects = await Project.count({
      where: { status: "completed" },
    });

    const totalTasks = await Task.count();
    const pendingTasks = await Task.count({ where: { status: "pending" } });
    const inProgressTasks = await Task.count({
      where: { status: "in-progress" },
    });
    const completedTasks = await Task.count({ where: { status: "completed" } });

    const totalUsers = await User.count();

    res.json({
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
      },
      tasks: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      users: {
        total: totalUsers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getMetrics,
};
