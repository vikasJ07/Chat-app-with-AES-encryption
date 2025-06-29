import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

// This hook is now a no-op after reverting real-time message logic.
const useListenMessages = () => {
  // No need to do anything here, as messages are managed in SocketContext
  // This hook is now a no-op, but can be used for side effects if needed
  useEffect(() => {}, []);
};

export default useListenMessages;
