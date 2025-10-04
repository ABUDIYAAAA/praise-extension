import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Backend API configuration
const API_URL = "http://localhost:5175";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Not authenticated:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth login - opens new tab for OAuth flow
  const loginWithGitHub = () => {
    const authWindow = window.open(
      `${API_URL}/auth/github?source=extension`,
      "github-oauth",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    // Listen for messages from the OAuth popup
    const handleMessage = (event) => {
      // Verify the origin for security
      if (event.origin !== API_URL.replace(":5000", ":5000")) {
        return;
      }

      if (event.data?.type === "AUTH_SUCCESS") {
        console.log("OAuth success received:", event.data.user);

        // Update user state immediately with the received user data
        setUser(event.data.user);
        setError(null);
        setLoading(false);

        // Close the popup if it's still open
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }

        // Remove event listener
        window.removeEventListener("message", handleMessage);

        // Also check auth from server to ensure consistency
        setTimeout(() => {
          checkAuth();
        }, 500);
      }
    };

    // Add event listener for messages
    window.addEventListener("message", handleMessage);

    // Fallback: Listen for window close (in case postMessage doesn't work)
    const checkClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);

        // Check if user is now authenticated
        setTimeout(() => {
          checkAuth();
        }, 1000);
      }
    }, 1000);

    // Clean up if something goes wrong
    setTimeout(() => {
      if (authWindow && !authWindow.closed) {
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
      }
    }, 300000); // 5 minutes timeout
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed");
      return { success: false, error: "Logout failed" };
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    loginWithGitHub,
    logout,
    checkAuth,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
