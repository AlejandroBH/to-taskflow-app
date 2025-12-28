const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Comment = require("./Comment");
const File = require("./File");

// Relaciones de Usuario
User.hasMany(Project, { foreignKey: "managerId", as: "managedProjects" });
User.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
User.hasMany(File, { foreignKey: "uploadedBy", as: "uploadedFiles" });

// Relaciones de Proyecto
Project.belongsTo(User, { foreignKey: "managerId", as: "manager" });
Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });

// Relaciones de Tarea
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });
Task.hasMany(Comment, { foreignKey: "taskId", as: "comments" });
Task.hasMany(File, { foreignKey: "taskId", as: "files" });

// Relaciones de Comentario
Comment.belongsTo(Task, { foreignKey: "taskId", as: "task" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Relaciones de Archivo
File.belongsTo(Task, { foreignKey: "taskId", as: "task" });
File.belongsTo(User, { foreignKey: "uploadedBy", as: "uploader" });

module.exports = {
  User,
  Project,
  Task,
  Comment,
  File,
};
