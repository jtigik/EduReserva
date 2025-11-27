import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useReservations } from "@/react-app/hooks/useReservations";

const SHIFTS = ["Manhã", "Tarde", "Noite"] as const;
const FLOORS = [1, 2, 3, 4, 5];
const ROOMS = [1, 2, 3, 4];

export default function AvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  
  const dateStr = selectedDate.toISOString().split("T")[0];
  const { data: reservations } = useReservations({ date: dateStr });

  const getRoomStatus = (floor: number, room: number, shift: string) => {
    if (!reservations) return "available";
    
    const reservation = reservations.find(
      (r: any) => r.floor === floor && r.room === room && r.shift === shift
    );
    
    return reservation ? "reserved" : "available";
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendário de Disponibilidade
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {formatDate(selectedDate)}
              </p>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Andar
              </label>
              <select
                value={selectedFloor || ""}
                onChange={(e) => setSelectedFloor(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os andares</option>
                {FLOORS.map((floor) => (
                  <option key={floor} value={floor}>
                    Andar {floor}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Turno
              </label>
              <select
                value={selectedShift || ""}
                onChange={(e) => setSelectedShift(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os turnos</option>
                {SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6">
            {SHIFTS.filter((shift) => !selectedShift || shift === selectedShift).map((shift) => (
              <div key={shift}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {shift}
                  <span className="text-sm font-normal text-gray-500">
                    ({shift === "Manhã" ? "7h-12h" : shift === "Tarde" ? "13h-18h" : "19h-22h"})
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {FLOORS.filter((floor) => !selectedFloor || floor === selectedFloor).map((floor) =>
                    ROOMS.map((room) => {
                      const status = getRoomStatus(floor, room, shift);
                      return (
                        <div
                          key={`${floor}-${room}`}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            status === "available"
                              ? "bg-green-50 border-green-200 hover:border-green-400"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className={`w-4 h-4 ${
                              status === "available" ? "text-green-600" : "text-red-600"
                            }`} />
                            <span className="font-semibold text-gray-900 text-sm">
                              Andar {floor} - Sala {room}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${
                            status === "available" ? "text-green-700" : "text-red-700"
                          }`}>
                            {status === "available" ? "Disponível" : "Reservada"}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
