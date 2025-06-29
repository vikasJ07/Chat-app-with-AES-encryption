import { useState, useRef, useEffect } from "react";
import useSendMessage from "../../hooks/useSendMessage";
import { BsSend } from "react-icons/bs";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { selectedConversation } = useConversation();
  const { loading, sendMessage } = useSendMessage(selectedConversation);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setMessage(e.target.value);
    adjustHeight(e.target);
  };

  const adjustHeight = (element) => {
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
    const maxRows = 4;
    const maxHeight = lineHeight * maxRows;
    element.style.height = "auto";
    if (element.scrollHeight > maxHeight) {
      element.style.height = `${maxHeight}px`;
      element.style.overflowY = "scroll";
    } else {
      element.style.height = `${element.scrollHeight}px`;
      element.style.overflowY = "hidden";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Optimistic UI update: dispatch a custom event
    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: JSON.parse(localStorage.getItem("chat-user"))._id,
      receiverId: selectedConversation._id,
      message,
      createdAt: new Date().toISOString(),
      shouldShake: true,
    };
    window.dispatchEvent(new CustomEvent("optimistic-message", { detail: optimisticMessage }));

    await sendMessage(message);
    setMessage("");
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [message]);

  return (
    <form className="px-4 py-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <textarea
          ref={textareaRef}
          className="w-full bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-300 rounded-2xl py-3 pl-5 pr-16 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-md resize-none transition-all placeholder:text-base-content/60"
          placeholder="Type your message..."
          value={message}
          onChange={handleInput}
          style={{ overflow: "hidden", lineHeight: "1.5em" }}
          rows={1}
          maxLength={1000}
        />
        <button
          type="submit"
          className="absolute right-3 bottom-3 bg-primary text-primary-content rounded-full p-3 shadow-lg hover:scale-110 focus:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading || !message.trim()}
          aria-label="Send message"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <BsSend className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
