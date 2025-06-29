import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useGetFriendRequests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState({ received: [], sent: [] });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/requests/all`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setRequests(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return { ...requests, loading };
};

export default useGetFriendRequests; 