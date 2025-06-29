import { useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const useMessageReaction = () => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const addReaction = useCallback(
    async (messageId, reactionType, conversationId) => {
      try {
        const res = await fetch(`/api/messages/${messageId}/reaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reactionType }),
        });

        if (!res.ok) {
          throw new Error("Failed to add reaction");
        }

        // Emit socket event for real-time updates
        socket.emit("message reaction", {
          messageId,
          reactionType,
          conversationId,
        });
      } catch (error) {
        console.error("Error adding reaction:", error);
      }
    },
    [socket]
  );

  const removeReaction = useCallback(
    async (messageId, reactionType, conversationId) => {
      try {
        const res = await fetch(`/api/messages/${messageId}/reaction`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reactionType }),
        });

        if (!res.ok) {
          throw new Error("Failed to remove reaction");
        }

        // Emit socket event for real-time updates
        socket.emit("message reaction", {
          messageId,
          reactionType: null,
          conversationId,
        });
      } catch (error) {
        console.error("Error removing reaction:", error);
      }
    },
    [socket]
  );

  return {
    addReaction,
    removeReaction,
  };
};

export default useMessageReaction; 