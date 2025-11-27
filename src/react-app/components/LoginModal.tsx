import { useAuth } from "@getmocha/users-service/react";
import { LogIn } from "lucide-react";

export default function LoginModal() {
  const { redirectToLogin } = useAuth();

  return (
    <div className="text-center">
      <button
        onClick={redirectToLogin}
        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <LogIn className="w-5 h-5" />
        Entrar com Google
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Faça login com sua conta Google para acessar o sistema
      </p>
    </div>
  );
}
