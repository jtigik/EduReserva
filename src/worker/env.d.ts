// Extend the Env interface with our custom bindings
interface Env {
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  DB: D1Database;
}
