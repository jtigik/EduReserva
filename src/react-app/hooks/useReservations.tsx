import { useState, useEffect } from "react";

interface UseReservationsOptions {
  date?: string;
  floor?: number;
  room?: number;
  shift?: string;
}

export function useReservations(options: UseReservationsOptions = {}) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options.date) params.append("date", options.date);
        if (options.floor) params.append("floor", options.floor.toString());
        if (options.room) params.append("room", options.room.toString());
        if (options.shift) params.append("shift", options.shift);

        const response = await fetch(`/api/reservations?${params}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [options.date, options.floor, options.room, options.shift]);

  const refetch = async () => {
    const params = new URLSearchParams();
    if (options.date) params.append("date", options.date);
    if (options.floor) params.append("floor", options.floor.toString());
    if (options.room) params.append("room", options.room.toString());
    if (options.shift) params.append("shift", options.shift);

    const response = await fetch(`/api/reservations?${params}`);
    const result = await response.json();
    setData(result);
  };

  return { data, isLoading, error, refetch };
}
