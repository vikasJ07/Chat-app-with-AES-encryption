import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { useAuthContext } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

  return (
    <section className="flex flex-col flex-grow bg-base-100 dark:bg-base-200 rounded-3xl shadow-2xl border-l-2 border-base-300 font-sans animate-fadeIn transition-all duration-500 overflow-hidden group hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] hover:scale-[1.01]">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="flex items-center gap-3 px-6 py-4 border-b border-base-300 bg-base-100 dark:bg-base-200">
            <img
              src={selectedConversation.profilePic}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-primary shadow-md object-cover"
              onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-base-content">{selectedConversation.fullName}</span>
              {isOnline && <span className="text-xs text-primary font-medium">Active now</span>}
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </section>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full bg-base-100 dark:bg-base-200 rounded-3xl animate-fadeIn">
      <div className="text-center p-8 rounded-2xl shadow-lg bg-base-100/80 dark:bg-base-200/80 border border-base-300">
        <h2 className="text-4xl font-extrabold mb-4 text-base-content drop-shadow">Welcome {authUser.fullName} 👋</h2>
        <p className="text-lg mb-6 text-base-content/70">Select a chat to start messaging</p>
        <TiMessages className="text-6xl mx-auto text-primary drop-shadow" />
      </div>
    </div>
  );
};
