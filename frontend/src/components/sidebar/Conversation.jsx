import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

const getRandomAvatar = (seed) =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || Math.random())}`;

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);
  const { authUser } = useAuthContext();
  const [friendStatus, setFriendStatus] = useState("");

  const profilePic = conversation.profilePic || getRandomAvatar(conversation._id || conversation.fullName || "user");
  const altText = `${conversation.fullName || "User"} avatar`;
  const avatarSeed = conversation._id || conversation.fullName || "user";

  useEffect(() => {
    if (!authUser) return;
    if (authUser.friends && authUser.friends.includes(conversation._id)) {
      setFriendStatus("friend");
    } else if (authUser.sentRequests && authUser.sentRequests.includes(conversation._id)) {
      setFriendStatus("requested");
    } else if (authUser.friendRequests && authUser.friendRequests.includes(conversation._id)) {
      setFriendStatus("pending");
    } else {
      setFriendStatus("");
    }
  }, [authUser, conversation._id]);

  const handleAddFriend = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${conversation._id}/request`, {
      method: "POST",
      credentials: "include",
    });
    setFriendStatus("requested");
  };

  const handleAccept = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${conversation._id}/accept`, {
      method: "POST",
      credentials: "include",
    });
    setFriendStatus("friend");
  };

  const handleReject = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${conversation._id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    setFriendStatus("");
  };

  return (
    <>
      <div
        className={`flex gap-3 items-center p-3 cursor-pointer rounded-2xl transition-all duration-300 shadow group animate-slideIn
          ${isSelected
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content scale-[1.03] shadow-xl"
            : "bg-gradient-to-r from-base-200/80 to-base-100/80 hover:from-secondary hover:to-secondary/80 hover:text-secondary-content text-base-content"}
        `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full border-2 border-primary/30 group-hover:border-secondary/40 transition-all">
            <img 
              src={profilePic}
              alt={altText}
              onError={e => { e.target.onerror = null; e.target.src = getRandomAvatar(avatarSeed); }}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">{conversation.fullName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
          {/* Friend request actions */}
          {friendStatus === "" && (
            <button className="btn btn-xs btn-primary mt-1" onClick={e => { e.stopPropagation(); handleAddFriend(); }}>Add Friend</button>
          )}
          {friendStatus === "requested" && (
            <span className="text-sm text-info mt-1">Requested</span>
          )}
          {friendStatus === "pending" && (
            <div className="flex gap-2 mt-1">
              <button className="btn btn-xs btn-success" onClick={e => { e.stopPropagation(); handleAccept(); }}>Accept</button>
              <button className="btn btn-xs btn-error" onClick={e => { e.stopPropagation(); handleReject(); }}>Reject</button>
            </div>
          )}
          {friendStatus === "friend" && (
            <span className="text-sm text-success mt-1">Friend</span>
          )}
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 h-px bg-base-300" />}
    </>
  );
};

export default Conversation;
