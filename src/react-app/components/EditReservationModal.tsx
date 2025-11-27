import { useState } from "react";
import { X, Calendar, MapPin, Clock, Users, FileText, User, AlertCircle, CheckCircle2 } from "lucide-react";

const SHIFTS = ["Manhã", "Tarde", "Noite"] as const;
const FLOORS = [1, 2, 3, 4, 5];
const ROOMS = [1, 2, 3, 4];

const MORNING_SLOTS = [
  "Horário 1 (7h-8h)",
  "Horário 2 (8h10-9h)",
  "Horário 3 (9h10-10h)",
  "Horário 4 (10h20-11h10)",
  "Horário 5 (11h10-12h)",
];

const AFTERNOON_SLOTS = [
  "Horário 1 (13h-14h)",
  "Horário 2 (14h10-15h)",
  "Horário 3 (15h10-16h)",
  "Horário 4 (16h20-17h10)",
  "Horário 5 (17h10-18h)",
];

const NIGHT_SLOTS = [
  "Horário 1 (19h-20h)",
  "Horário 2 (20h-21h)",
  "Horário 3 (21h-22h)",
];

interface EditReservationModalProps {
  reservation: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditReservationModal({ reservation, onClose, onSuccess }: EditReservationModalProps) {
  const initialTimeSlots = JSON.parse(reservation.time_slots);

  const [formData, setFormData] = useState({
    floor: reservation.floor.toString(),
    room: reservation.room.toString(),
    date: reservation.date,
    shift: reservation.shift,
    time_slots: initialTimeSlots,
    reason: reservation.reason,
    responsible_person: reservation.responsible_person,
    participants: reservation.participants,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getTimeSlots = () => {
    switch (formData.shift) {
      case "Manhã":
        return MORNING_SLOTS;
      case "Tarde":
        return AFTERNOON_SLOTS;
      case "Noite":
        return NIGHT_SLOTS;
      default:
        return [];
    }
  };

  const handleTimeSlotToggle = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      time_slots: prev.time_slots.includes(slot)
        ? prev.time_slots.filter((s: string) => s !== slot)
        : [...prev.time_slots, slot],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          floor: parseInt(formData.floor),
          room: parseInt(formData.room),
          date: formData.date,
          shift: formData.shift,
          time_slots: formData.time_slots,
          reason: formData.reason,
          responsible_person: formData.responsible_person,
          participants: formData.participants,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao atualizar reserva");
      }

      setSuccess("Reserva atualizada com sucesso!");
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">Editar Reserva</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data
              </label>
              <input
                type="date"
                required
                min={minDate}
                max={maxDate}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Turno
              </label>
              <select
                required
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value, time_slots: [] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Andar
              </label>
              <select
                required
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value, room: "" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FLOORS.map((floor) => (
                  <option key={floor} value={floor}>
                    Andar {floor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sala</label>
              <select
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ROOMS.map((room) => (
                  <option key={room} value={room}>
                    Sala {room}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.shift && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Horários (selecione um ou mais)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {getTimeSlots().map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.time_slots.includes(slot)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.time_slots.includes(slot)}
                      onChange={() => handleTimeSlotToggle(slot)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Motivo da Reserva
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Responsável
              </label>
              <input
                type="text"
                required
                value={formData.responsible_person}
                onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Número de Participantes
              </label>
              <input
                type="number"
                required
                min={1}
                max={30}
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || formData.time_slots.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
