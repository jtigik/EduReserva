import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import HomePage from "@/react-app/pages/Home";
import MyReservationsPage from "@/react-app/pages/MyReservations";
import NewReservationPage from "@/react-app/pages/NewReservation";
import { AuthProvider } from "@getmocha/users-service/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/new-reservation"
            element={
              <ProtectedRoute>
                <NewReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute>
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
