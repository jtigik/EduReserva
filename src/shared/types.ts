import z from "zod";

export const ReservationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  user_email: z.string(),
  user_name: z.string(),
  floor: z.number().min(1).max(5),
  room: z.number().min(1).max(4),
  date: z.string(),
  shift: z.enum(["Manhã", "Tarde", "Noite"]),
  time_slots: z.string(),
  reason: z.string(),
  responsible_person: z.string(),
  participants: z.number().min(1).max(30),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Reservation = z.infer<typeof ReservationSchema>;

export const CreateReservationSchema = z.object({
  floor: z.number().min(1).max(5),
  room: z.number().min(1).max(4),
  date: z.string(),
  shift: z.enum(["Manhã", "Tarde", "Noite"]),
  time_slots: z.array(z.string()).min(1),
  reason: z.string().min(1),
  responsible_person: z.string().min(1),
  participants: z.number().min(1).max(30),
});

export type CreateReservation = z.infer<typeof CreateReservationSchema>;

export const UpdateReservationSchema = CreateReservationSchema.partial();

export type UpdateReservation = z.infer<typeof UpdateReservationSchema>;
