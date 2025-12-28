import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import type { Project } from "../../types";
import { Plus, Calendar, User } from "lucide-react";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error al recuperar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando proyectos...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {project.name}
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === "active"
                    ? "bg-green-100 text-green-800"
                    : project.status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {project.status === "active"
                  ? "Activo"
                  : project.status === "completed"
                  ? "Completado"
                  : "Archivado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {project.description || "Sin descripción."}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="flex items-center">
                <User className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                Dueño #{project.managerId}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow dashed border-2 border-gray-200">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No hay proyectos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando un nuevo proyecto.
          </p>
          <div className="mt-6">
            <Link
              to="/projects/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Nuevo Proyecto
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
