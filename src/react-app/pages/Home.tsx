import { useAuth } from "@getmocha/users-service/react";
import { Link } from "react-router";
import { Calendar, Plus, School, CheckCircle2 } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import LoginModal from "@/react-app/components/LoginModal";
import AvailabilityCalendar from "@/react-app/components/AvailabilityCalendar";

export default function Home() {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="animate-spin">
          <Calendar className="w-10 h-10 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-xl mb-6">
              <School className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">EduReserva</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema de gerenciamento de reservas de salas de aula para escolas
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Bem-vindo ao EduReserva</h2>
              <p className="text-blue-50 text-lg">
                Gerencie reservas de salas para atividades extracurriculares, reuniões e eventos de forma simples e eficiente.
              </p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reservas Rápidas</h3>
                    <p className="text-gray-600 text-sm">
                      Visualize disponibilidade em tempo real e reserve salas em poucos cliques
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">20 Salas Disponíveis</h3>
                    <p className="text-gray-600 text-sm">
                      5 andares com 4 salas cada, distribuídas em 3 turnos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Calendário Visual</h3>
                    <p className="text-gray-600 text-sm">
                      Acompanhe todas as reservas através de um calendário intuitivo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Gestão Simplificada</h3>
                    <p className="text-gray-600 text-sm">
                      Edite ou cancele suas reservas facilmente quando necessário
                    </p>
                  </div>
                </div>
              </div>

              <LoginModal />
            </div>
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Sistema de gerenciamento escolar desenvolvido para educadores</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Olá, {user.google_user_data.name || user.email}! Visualize e gerencie as reservas de salas.
          </p>
        </div>

        <div className="mb-6">
          <Link
            to="/new-reservation"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Reserva
          </Link>
        </div>

        <AvailabilityCalendar />
      </div>
    </div>
  );
}
