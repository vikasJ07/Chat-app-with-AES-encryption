import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useGetMessages = (selectedConversation) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${selectedConversation._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation]);
  return { messages, loading };
};

export default useGetMessages;
