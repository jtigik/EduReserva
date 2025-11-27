import { useState, useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import Navbar from "@/react-app/components/Navbar";
import { Calendar, MapPin, Clock, Users, FileText, User, Trash2, Edit } from "lucide-react";
import EditReservationModal from "@/react-app/components/EditReservationModal";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";

export default function MyReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [deletingReservation, setDeletingReservation] = useState<any>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reservations");
      const data = await response.json();
      const userReservations = data.filter((r: any) => r.user_id === user?.id);
      setReservations(userReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const filteredReservations = reservations.filter((r) => {
    if (filterDate && r.date !== filterDate) return false;
    if (filterShift && r.shift !== filterShift) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    });
  };

  const formatTimeSlots = (timeSlotsStr: string) => {
    try {
      const slots = JSON.parse(timeSlotsStr);
      return slots.join(", ");
    } catch {
      return timeSlotsStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin">
            <Calendar className="w-10 h-10 text-blue-600" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">Visualize, edite ou cancele suas reservas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Filtros</h2>
          </div>

          <div className="p-6 flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
              <select
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os turnos</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            {(filterDate || filterShift) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterDate("");
                    setFilterShift("");
                  }}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center bg-blue-100 p-4 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {reservations.length === 0 ? "Nenhuma reserva encontrada" : "Nenhuma reserva corresponde aos filtros"}
            </h3>
            <p className="text-gray-600">
              {reservations.length === 0
                ? "Você ainda não fez nenhuma reserva. Clique em 'Nova Reserva' para começar."
                : "Tente ajustar os filtros para ver suas reservas."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Andar {reservation.floor} - Sala {reservation.room}
                      </h3>
                      <p className="text-sm text-gray-500">ID da Reserva: #{reservation.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingReservation(reservation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeletingReservation(reservation)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Data</p>
                        <p className="font-medium text-gray-900">{formatDate(reservation.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Turno</p>
                        <p className="font-medium text-gray-900">{reservation.shift}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Responsável</p>
                        <p className="font-medium text-gray-900">{reservation.responsible_person}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Participantes</p>
                        <p className="font-medium text-gray-900">{reservation.participants}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Horários</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTimeSlots(reservation.time_slots)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Motivo
                      </p>
                      <p className="text-sm text-gray-700">{reservation.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          onClose={() => setEditingReservation(null)}
          onSuccess={() => {
            setEditingReservation(null);
            fetchReservations();
          }}
        />
      )}

      {deletingReservation && (
        <DeleteConfirmModal
          reservation={deletingReservation}
          onClose={() => setDeletingReservation(null)}
          onSuccess={() => {
            setDeletingReservation(null);
            fetchReservations();
          }}
        />
      )}
    </div>
  );
}
