import { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  reservation: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ reservation, onClose, onSuccess }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao cancelar reserva");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao cancelar reserva");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Cancelar Reserva
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Local:</span> Andar {reservation.floor} - Sala {reservation.room}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Data:</span> {formatDate(reservation.date)}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Turno:</span> {reservation.shift}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Motivo:</span> {reservation.reason}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                "Cancelando..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Confirmar Cancelamento
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
