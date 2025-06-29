import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("chat-user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      return null;
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        
        // If response is not OK (e.g., 401 Unauthorized), or if no user is returned,
        // it means the session is invalid or expired.
        if (!res.ok) {
          throw new Error("Session invalid or expired");
        }

        const user = await res.json();
        if (!user || !user._id) {
          throw new Error("No user data received");
        }
        
        // Update authUser and localStorage with the fresh data
        setAuthUser(user);
        localStorage.setItem("chat-user", JSON.stringify(user));

      } catch (error) {
        console.error("Authentication check failed:", error.message);
        // Clear authUser and localStorage if authentication fails
        setAuthUser(null);
        localStorage.removeItem("chat-user");
        // Redirect to login if not already there, unless it's the admin page
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          window.location.href = "/login";
        }
      }
    };

    // Run auth check on initial mount
    checkAuth();

  }, []); // Empty dependency array means this runs once on mount

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
