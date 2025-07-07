import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isCheckingAuth || !user) {
    return <div>Loading Dashboard...</div>; // or a Spinner
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <h1 className="text-lg font-semibold mb-4">Your email is: {user?.email}!</h1>
      <p className="mb-6 text-gray-700">You are now logged in.</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600 transition">
        Logout
      </button>
    </div>
  );
}
