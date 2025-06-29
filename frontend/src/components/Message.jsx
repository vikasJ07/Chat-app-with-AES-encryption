import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import useMessageStatus from "../hooks/useMessageStatus";
import useMessageReaction from "../hooks/useMessageReaction";
import useMessageActions from "../hooks/useMessageActions";
import { formatDistanceToNow } from "date-fns";

const Message = ({ message, conversationId }) => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);
  const editInputRef = useRef(null);
  const { markMessageAsRead, markMessageAsDelivered } = useMessageStatus();
  const { addReaction, removeReaction } = useMessageReaction();
  const { editMessage, deleteMessage, canEditMessage, canDeleteMessage } = useMessageActions();

  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const bubbleBgColor = fromMe ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content";
  const shakeClass = message.shake ? "shake" : "";

  useEffect(() => {
    if (!fromMe && !message.isRead) {
      markMessageAsRead(message._id);
    } else if (!fromMe && !message.isDelivered) {
      markMessageAsDelivered(message._id);
    }
  }, [message, fromMe, markMessageAsRead, markMessageAsDelivered]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedMessage(message.message);
  };

  const handleSaveEdit = async () => {
    if (editedMessage.trim() === "") return;
    await editMessage(message._id, editedMessage, conversationId);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message.message);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(message._id, conversationId);
    }
  };

  const handleReaction = async (reactionType) => {
    const hasReaction = message.reactions?.some(
      (r) => r.userId === authUser._id && r.type === reactionType
    );

    if (hasReaction) {
      await removeReaction(message._id, reactionType, conversationId);
    } else {
      await addReaction(message._id, reactionType, conversationId);
    }
  };

  const renderReactions = () => {
    if (!message.reactions?.length) return null;

    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex gap-1 mt-1">
        {Object.entries(reactionCounts).map(([type, count]) => (
          <div
            key={type}
            className="badge badge-outline badge-primary badge-sm text-xs"
            title={`${count} ${type} reaction${count > 1 ? "s" : ""}`}
          >
            {type} {count}
          </div>
        ))}
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return <span className="italic text-base-content opacity-50">This message was deleted</span>;
    }

    if (isEditing) {
      return (
        <div className="flex gap-2 w-full">
          <input
            ref={editInputRef}
            type="text"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="input input-bordered input-sm input-primary w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") handleCancelEdit();
            }}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSaveEdit}
          >
            Save
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2">
          <p className={`${message.isEdited ? "italic opacity-80" : ""}`}>
            {message.message}
          </p>
          {message.isEdited && (
            <span className="text-xs opacity-50">(edited)</span>
          )}
        </div>
        {renderReactions()}
      </>
    );
  };

  const renderMessageActions = () => {
    if (message.isDeleted || isEditing) return null;

    return (
      <div className="flex gap-2 mt-1">
        <div className="flex gap-1">
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => handleReaction("👍")}
          >
            👍
          </button>
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => handleReaction("❤️")}
          >
            ❤️
          </button>
          <button
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => handleReaction("😂")}
          >
            😂
          </button>
        </div>
        {canEditMessage(message) && (
          <button
            className="btn btn-xs btn-ghost"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
        {canDeleteMessage(message) && (
          <button
            className="btn btn-xs btn-error btn-ghost"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User Avatar"
            src={message.senderId === authUser._id ? authUser.profilePic : message.senderProfilePic}
          />
        </div>
      </div>
      <div className="chat-header text-base-content opacity-70">
        {message.senderId === authUser._id ? "You" : message.senderFullName}
        <time className="text-xs opacity-50 ml-1">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </time>
      </div>
      <div
        className={`chat-bubble ${bubbleBgColor} ${shakeClass} py-2`}
      >
        {renderMessageContent()}
      </div>
      {renderMessageActions()}
      <div className="chat-footer opacity-50 text-base-content text-xs">
        {message.status === "read" ? "Read" : message.status === "delivered" ? "Delivered" : "Sent"}
      </div>
    </div>
  );
};

export default Message; 