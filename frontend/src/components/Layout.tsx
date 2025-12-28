import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Home, FolderKanban, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Panel Principal", href: "/", icon: Home },
    { name: "Proyectos", href: "/projects", icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex border-t border-gray-200 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs font-medium text-gray-500">Ver Perfil</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-500"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow md:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menú lateral</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
