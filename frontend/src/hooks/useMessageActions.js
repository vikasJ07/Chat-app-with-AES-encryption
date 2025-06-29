import { useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const useMessageActions = () => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const editMessage = useCallback(
    async (messageId, newMessage, conversationId) => {
      try {
        const res = await fetch(`/api/messages/${messageId}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newMessage }),
        });

        if (!res.ok) {
          throw new Error("Failed to edit message");
        }

        // Emit socket event for real-time updates
        socket.emit("message edit", {
          messageId,
          newMessage,
          conversationId,
        });
      } catch (error) {
        console.error("Error editing message:", error);
      }
    },
    [socket]
  );

  const deleteMessage = useCallback(
    async (messageId, conversationId) => {
      try {
        const res = await fetch(`/api/messages/${messageId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete message");
        }

        // Emit socket event for real-time updates
        socket.emit("message delete", {
          messageId,
          conversationId,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    [socket]
  );

  const canEditMessage = useCallback(
    (message) => {
      return message.senderId === authUser._id && !message.isDeleted;
    },
    [authUser]
  );

  const canDeleteMessage = useCallback(
    (message) => {
      return message.senderId === authUser._id;
    },
    [authUser]
  );

  return {
    editMessage,
    deleteMessage,
    canEditMessage,
    canDeleteMessage,
  };
};

export default useMessageActions; 