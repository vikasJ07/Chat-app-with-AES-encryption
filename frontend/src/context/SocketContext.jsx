import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io(import.meta.env.VITE_API_URL, {
        query: {
          userId: authUser._id,
        },
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("newMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        console.log("Received newMessage in context", newMessage);
      });

      setSocket(socket);

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};
