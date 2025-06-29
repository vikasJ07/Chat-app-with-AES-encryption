import { useState } from "react";
import toast from "react-hot-toast";

const useSendMessage = (selectedConversation) => {
  const [loading, setLoading] = useState(false);
  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
