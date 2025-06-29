import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const getRandomAvatar = (seed) =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || Math.random())}`;

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";

  // Use sender's profilePic if available, else fallback to random avatar
  let profilePic = "";
  let altText = "User avatar";
  let seed = "user";
  if (fromMe) {
    profilePic = authUser.profilePic;
    altText = `${authUser.fullName || "You"} avatar`;
    seed = authUser._id || authUser.fullName || "me";
  } else if (message.senderProfilePic) {
    profilePic = message.senderProfilePic;
    altText = `${message.senderFullName || "User"} avatar`;
    seed = message.senderId || message.senderFullName || "user";
  } else if (selectedConversation?.profilePic) {
    profilePic = selectedConversation.profilePic;
    altText = `${selectedConversation.fullName || "User"} avatar`;
    seed = selectedConversation._id || selectedConversation.fullName || "user";
  }
  // If no profilePic, use random avatar
  if (!profilePic) profilePic = getRandomAvatar(seed);

  const formattedTime = extractTime(message.createdAt);
  const shakeClass = message.shouldShake ? "shake" : "";

  // Theme-aware gradient bubble
  const bubbleGradient = fromMe
    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content"
    : "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-content";

  return (
    <div className={`chat ${chatClassName} animate-slideIn`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={altText}
            src={profilePic}
            onError={e => {
              e.target.onerror = null;
              e.target.src = getRandomAvatar(seed);
            }}
          />
        </div>
      </div>
      <div
        className={`chat-bubble ${bubbleGradient} ${shakeClass} pb-2 maxWidth shadow-lg hover:scale-105 transition-all duration-300`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
