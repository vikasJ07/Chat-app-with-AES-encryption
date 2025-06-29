import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  
  const login = async (username, password, isAdmin = false) => {
    const success = handleInputErrors(username, password);
    if (!success) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isAdmin }),
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Store user data in localStorage
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);

      // Show success message
      toast.success(`Welcome ${data.fullName}!`);

      // If admin login successful, redirect to admin dashboard
      if (isAdmin && data.role === "admin") {
        window.location.href = "/admin";
      } else if (!isAdmin) {
        // If regular user, redirect to home
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
