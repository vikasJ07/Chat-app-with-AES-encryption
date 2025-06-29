import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

const Messages = () => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { messages: initialMessages, loading } = useGetMessages(selectedConversation);
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef();

  // Initialize messages from API when conversation changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Real-time socket updates for new messages
  useEffect(() => {
    if (!socket || !selectedConversation || !authUser) return;
    const handleNewMessage = (newMessage) => {
      // Robust string comparison for IDs
      const senderId = newMessage.senderId?.toString();
      const receiverId = newMessage.receiverId?.toString();
      const conversationId = selectedConversation._id?.toString();
      const myId = authUser._id?.toString();
      console.log("[DEBUG] newMessage:", newMessage);
      console.log("[DEBUG] senderId:", senderId, "receiverId:", receiverId, "conversationId:", conversationId, "myId:", myId);
      // Only add if the message is for the current conversation
      if (
        (senderId === conversationId && receiverId === myId) ||
        (receiverId === conversationId && senderId === myId) ||
        senderId === conversationId ||
        receiverId === conversationId
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, authUser]);

  // Optimistic UI update for instant message display
  useEffect(() => {
    const handleOptimistic = (e) => {
      const optimisticMessage = e.detail;
      if (
        optimisticMessage.receiverId === selectedConversation._id ||
        optimisticMessage.senderId === selectedConversation._id
      ) {
        setMessages((prev) => [...prev, optimisticMessage]);
      }
    };
    window.addEventListener("optimistic-message", handleOptimistic);
    return () => {
      window.removeEventListener("optimistic-message", handleOptimistic);
    };
  }, [selectedConversation]);

  // Auto-refresh polling every 2 seconds
  useEffect(() => {
    if (!selectedConversation?._id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${selectedConversation._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [selectedConversation]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 py-2 flex-1 overflow-auto rounded-b-box">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center text-base-content opacity-70">Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
