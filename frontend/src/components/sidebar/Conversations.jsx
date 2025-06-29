import useGetConversations from "../../hooks/useGetConversations";
import useGetFriendRequests from "../../hooks/useGetFriendRequests";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  const { received, sent } = useGetFriendRequests();
  const { authUser } = useAuthContext();

  return (
    <div className="flex flex-col gap-1 overflow-auto p-2 rounded-box shadow-inner flex-grow">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? (
        <span className="loading loading-spinner loading-lg mx-auto text-primary"></span>
      ) : null}
    </div>
  );
};

export default Conversations;
