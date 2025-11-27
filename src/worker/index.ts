import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { CreateReservationSchema, UpdateReservationSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Reservation endpoints
app.get("/api/reservations", authMiddleware, async (c) => {
  const date = c.req.query("date");
  const floor = c.req.query("floor");
  const room = c.req.query("room");
  const shift = c.req.query("shift");

  let query = "SELECT * FROM reservations WHERE 1=1";
  const params: any[] = [];

  if (date) {
    query += " AND date = ?";
    params.push(date);
  }

  if (floor) {
    query += " AND floor = ?";
    params.push(parseInt(floor));
  }

  if (room) {
    query += " AND room = ?";
    params.push(parseInt(room));
  }

  if (shift) {
    query += " AND shift = ?";
    params.push(shift);
  }

  query += " ORDER BY date DESC, floor ASC, room ASC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json(results);
});

app.post("/api/reservations", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();

  const validation = CreateReservationSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: "Invalid data", details: validation.error }, 400);
  }

  const data = validation.data;

  // Check availability
  const timeSlots = JSON.stringify(data.time_slots);
  const { results: existing } = await c.env.DB.prepare(
    "SELECT time_slots FROM reservations WHERE floor = ? AND room = ? AND date = ? AND shift = ?"
  )
    .bind(data.floor, data.room, data.date, data.shift)
    .all();

  if (existing.length > 0) {
    const existingSlots = JSON.parse((existing[0] as any).time_slots);
    const conflict = data.time_slots.some((slot: string) => existingSlots.includes(slot));
    
    if (conflict) {
      return c.json({ error: "Sala indisponível para os horários selecionados" }, 409);
    }
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO reservations (user_id, user_email, user_name, floor, room, date, shift, time_slots, reason, responsible_person, participants)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      user.id,
      user.email,
      user.google_user_data.name || user.email,
      data.floor,
      data.room,
      data.date,
      data.shift,
      timeSlots,
      data.reason,
      data.responsible_person,
      data.participants
    )
    .run();

  return c.json({ id: result.meta.last_row_id, ...data, time_slots: timeSlots }, 201);
});

app.get("/api/reservations/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const { results } = await c.env.DB.prepare("SELECT * FROM reservations WHERE id = ?")
    .bind(id)
    .all();

  if (results.length === 0) {
    return c.json({ error: "Reservation not found" }, 404);
  }

  return c.json(results[0]);
});

app.put("/api/reservations/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");
  const body = await c.req.json();

  const validation = UpdateReservationSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: "Invalid data", details: validation.error }, 400);
  }

  const { results: existing } = await c.env.DB.prepare(
    "SELECT * FROM reservations WHERE id = ?"
  )
    .bind(id)
    .all();

  if (existing.length === 0) {
    return c.json({ error: "Reservation not found" }, 404);
  }

  const reservation = existing[0] as any;

  if (reservation.user_id !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const data = validation.data;
  const updates: string[] = [];
  const params: any[] = [];

  if (data.floor !== undefined) {
    updates.push("floor = ?");
    params.push(data.floor);
  }
  if (data.room !== undefined) {
    updates.push("room = ?");
    params.push(data.room);
  }
  if (data.date !== undefined) {
    updates.push("date = ?");
    params.push(data.date);
  }
  if (data.shift !== undefined) {
    updates.push("shift = ?");
    params.push(data.shift);
  }
  if (data.time_slots !== undefined) {
    updates.push("time_slots = ?");
    params.push(JSON.stringify(data.time_slots));
  }
  if (data.reason !== undefined) {
    updates.push("reason = ?");
    params.push(data.reason);
  }
  if (data.responsible_person !== undefined) {
    updates.push("responsible_person = ?");
    params.push(data.responsible_person);
  }
  if (data.participants !== undefined) {
    updates.push("participants = ?");
    params.push(data.participants);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(id);

  await c.env.DB.prepare(
    `UPDATE reservations SET ${updates.join(", ")} WHERE id = ?`
  )
    .bind(...params)
    .run();

  const { results: updated } = await c.env.DB.prepare(
    "SELECT * FROM reservations WHERE id = ?"
  )
    .bind(id)
    .all();

  return c.json(updated[0]);
});

app.delete("/api/reservations/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  const { results: existing } = await c.env.DB.prepare(
    "SELECT * FROM reservations WHERE id = ?"
  )
    .bind(id)
    .all();

  if (existing.length === 0) {
    return c.json({ error: "Reservation not found" }, 404);
  }

  const reservation = existing[0] as any;

  if (reservation.user_id !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  await c.env.DB.prepare("DELETE FROM reservations WHERE id = ?").bind(id).run();

  return c.json({ success: true });
});

app.get("/api/availability", authMiddleware, async (c) => {
  const date = c.req.query("date");
  const floor = c.req.query("floor");
  const shift = c.req.query("shift");

  if (!date) {
    return c.json({ error: "Date is required" }, 400);
  }

  let query = "SELECT floor, room, shift, time_slots FROM reservations WHERE date = ?";
  const params: any[] = [date];

  if (floor) {
    query += " AND floor = ?";
    params.push(parseInt(floor));
  }

  if (shift) {
    query += " AND shift = ?";
    params.push(shift);
  }

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json(results);
});

export default app;
