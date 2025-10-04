import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FloatingBits from "../components/FloatingBits";
import Glow from "../components/Glow";

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

  // 🎉 Confetti on the entire browser window (active tab)
  const launchFullPageConfetti = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) return;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
          script.onload = () => {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
              window.confetti({
                particleCount: 5,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
              });
              window.confetti({
                particleCount: 5,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
              });
              if (Date.now() < end) requestAnimationFrame(frame);
            })();
          };
          document.body.appendChild(script);
        },
      });
    } catch (err) {
      console.error("Confetti failed:", err);
    }
  };

  // Loading and redirect states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] min-w-[350px] max-w-[400px] bg-black text-white rounded-xl shadow-2xl mx-auto">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] min-w-[350px] max-w-[400px] bg-black text-white rounded-xl shadow-2xl mx-auto">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-[400px] min-w-[350px] max-w-[400px] bg-black p-0 shadow-2xl mx-auto overflow-hidden rounded-xl">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingBits />
        <Glow />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 bg-gray-900/70 backdrop-blur-sm border border-gray-800 shadow-lg rounded-xl h-full p-6 w-3/4 max-w-sm flex flex-col justify-center items-center text-white text-center">
        <h1 className="text-lg font-semibold mb-2">Welcome to Praise</h1>

        <div className="w-full bg-gray-800/40 rounded-lg p-4 text-sm text-gray-300 text-left space-y-2 mb-3">
          <p>
            <span className="text-gray-400 font-medium">Username:</span>{" "}
            {user.githubUsername || "N/A"}
          </p>
          <p>
            <span className="text-gray-400 font-medium">Email:</span>{" "}
            {user.email || "N/A"}
          </p>
        </div>

        {/* 🎉 Celebrate Button */}
        <button
          onClick={launchFullPageConfetti}
          className="w-full bg-green-500/90 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300 mb-3"
        >
          🎉 Celebrate!
        </button>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/90 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300"
        >
          Sign Out
        </button>

        <p className="mt-3 text-[11px] text-gray-400 italic leading-snug">
          Stay consistent. Track your progress. Praise your growth.
        </p>
      </div>
    </div>
  );
}
