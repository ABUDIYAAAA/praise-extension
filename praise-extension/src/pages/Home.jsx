import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [user, loading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Praise!
        </h1>

        {/* Simple user info display as requested */}
        <p>Username: {user.githubUsername || "N/A"}</p>
        <p>Email: {user.email || "N/A"}</p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
