import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { loginWithGitHub, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [oauthInProgress, setOauthInProgress] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setOauthInProgress(false);
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    setOauthInProgress(true);
    loginWithGitHub();

    // Reset oauth in progress after timeout (in case window doesn't close properly)
    setTimeout(() => {
      setOauthInProgress(false);
    }, 30000); // 30 seconds timeout
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Praise
          </h1>
          <p className="text-gray-600">
            Sign in to track your development activity
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* OAuth Progress Message */}
        {oauthInProgress && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md text-sm text-center">
            🔐 Please complete authentication in the popup window...
          </div>
        )}

        {/* GitHub Login Button */}
        <button
          onClick={handleGitHubLogin}
          disabled={loading || oauthInProgress}
          className="w-full flex items-center justify-center bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || oauthInProgress ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Sign in with GitHub
            </>
          )}
        </button>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>
            By signing in, you agree to connect your GitHub account and allow us
            to track your repository activity.
          </p>
        </div>
      </div>
    </div>
  );
}
