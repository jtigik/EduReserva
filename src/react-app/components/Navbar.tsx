import { useAuth } from "@getmocha/users-service/react";
import { Link, useLocation } from "react-router";
import { Calendar, Plus, List, LogOut, School } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-all">
              <School className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">EduReserva</span>
              <span className="text-xs text-gray-500 hidden sm:block">Gerenciamento de Salas</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/new-reservation"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/new-reservation")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Reserva</span>
            </Link>

            <Link
              to="/my-reservations"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/my-reservations")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Minhas Reservas</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
