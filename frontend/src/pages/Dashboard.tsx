import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { Metrics } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get<Metrics>("/metrics");
        setMetrics(data);
      } catch (error) {
        console.error("Error al obtener las métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Panel Principal</h1>
      <div className="mt-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">
            ¡Bienvenido de nuevo, {user?.name || "Usuario"}!
          </h2>
          <p className="mt-2 text-gray-600">
            Aquí tienes un resumen de tus proyectos y tareas.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-indigo-50 px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Proyectos
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-900">
                {loading ? "-" : metrics?.projects.total || 0}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Tareas Activas
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900">
                {loading
                  ? "-"
                  : (metrics?.tasks.pending || 0) +
                  (metrics?.tasks.inProgress || 0)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
