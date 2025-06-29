import { useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const useMessageStatus = () => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const updateMessageStatus = useCallback(
    async (messageId, status) => {
      try {
        const res = await fetch(`/api/messages/${messageId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!res.ok) {
          throw new Error("Failed to update message status");
        }

        // Emit socket event for real-time updates
        socket.emit("message status update", {
          messageId,
          status,
          receiverId: authUser._id,
        });
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    },
    [socket, authUser]
  );

  const markMessageAsRead = useCallback(
    (messageId) => {
      updateMessageStatus(messageId, "read");
    },
    [updateMessageStatus]
  );

  const markMessageAsDelivered = useCallback(
    (messageId) => {
      updateMessageStatus(messageId, "delivered");
    },
    [updateMessageStatus]
  );

  return {
    updateMessageStatus,
    markMessageAsRead,
    markMessageAsDelivered,
  };
};

export default useMessageStatus; 