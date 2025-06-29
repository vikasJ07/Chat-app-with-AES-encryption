import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

const useGetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error in useGetUsers: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.role === "admin") {
      getUsers();
    }
  }, [authUser]);

  return { users, loading };
};

export default useGetUsers; 