import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import AboutUs from "./pages/AboutUs";

function App() {
  const { authUser } = useAuthContext();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "formal"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "formal" ? "dark" : "formal"));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center font-sans transition-all duration-700 animate-fadein"
      style={{ minHeight: "100vh" }}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          className="btn btn-ghost btn-circle text-2xl"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "formal" ? <MdDarkMode /> : <MdLightMode />}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={authUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/home" /> : <SignUp />} />
        <Route path="/admin" element={authUser?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/home" element={authUser ? <Home /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
