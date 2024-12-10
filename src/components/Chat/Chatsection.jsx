import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import {
  FaSearch,
  FaVideo,
  FaPhone,
  FaEllipsisV,
  FaPlay,
  FaPause,
  FaVolumeUp,
} from "react-icons/fa";
import "./Chatsection.css";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:8080";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI5Njc0MDRmMjEzZWJmZDVmYjAyOCIsImVtYWlsIjoiYWxwaGFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbHBoYSIsImlhdCI6MTczMzcyMzIyMCwiZXhwIjoxNzMzODA5NjIwfQ.rUn9mR_rj-Q4Iy5Hre8jcMLnhvLhTY1i_CAR16AXCFc";

const Chatsection = ({ selectedChatId }) => {
  const [socket, setSocket] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    console.log(selectedChatId)
    const socketConnection = io(`${SERVER_URL}/im`, { query: { token } });
    setSocket(socketConnection);

    // Handle socket events
    socketConnection.on("connect", () => {
      console.log("Connected to socket server.");
      const participantId = "6752968504f213ebfd5fb02c"; // Beta's user ID

      // Check conversation
      socketConnection.emit("checkConversation", { participantId });
      socketConnection.on("conversationCheckResponse", (data) => {
        if (data.exists) {
          setActiveConversationId(data.conversationId);
          setMessages(data.messages || []);
          socketConnection.emit("joinRoom", data.conversationId);
        } else {
          socketConnection.emit("createConversation", { participantId });
        }
      });

      // Handle new conversation creation
      socketConnection.on("chatRoomCreated", (conversationId) => {
        setActiveConversationId(conversationId);
        socketConnection.emit("joinRoom", conversationId);
      });

      // Handle incoming messages
      socketConnection.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
        socketConnection.emit("isDelivered", msg.messageId);
        socketConnection.emit("markAsSeen", msg.messageId);
      });

      // Handle typing events
      socketConnection.on("Typing", () => setIsTyping(true));
      socketConnection.on("stopTyping", () => setIsTyping(false));
    });

    socketConnection.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (activeConversationId && inputValue.trim()) {
      const messagePayload = {
        conversationId: activeConversationId,
        message: inputValue,
      };

      // Emit message to server
      socket.emit("sendMessage", messagePayload, (response) => {
        if (response.error) {
          console.error("Failed to send message:", response.error);
        } else {
          console.log("Message sent successfully:", response);
          setMessages((prev) => [
            ...prev,
            {
              senderId: "alpha",
              message: inputValue,
              sentAt: new Date().toISOString(),
            },
          ]);
          setInputValue("");
        }
      });
    }
  };

  const handleTyping = () => {
    if (activeConversationId) {
      socket.emit("typing", activeConversationId);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputValue(inputValue + emojiData.emoji);
  };

  return (
    <div className="Container-right">
      <div className="navbar-right">
        <div className="logo">
          <img
            className="logo-img-chat"
            src="profilePicUrl" // Replace with actual image URL
            alt="logo"
          />
          <div className="name-container">
            <span className="name-right">Chat</span> {/* Replace with dynamic name */}
          </div>
        </div>
        <div className="icon-container">
          <div className="icons">
            <FaPhone className="icon-size" />
          </div>
          <div className="icons">
            <FaVideo className="icon-size" />
          </div>
          <div className="icons">
            <FaSearch className="icon-size" />
          </div>
          <div className="icons">
            <FaEllipsisV className="icon-size" />
          </div>
        </div>
      </div>

      <div className="chatsection">
        <div className="crpto-container">
          <span className="encrypt-text">
            🔒 Messages and calls are end-to-end encrypted.
          </span>
        </div>

        {messages.map((message, index) => (
          <div
            key={`${message.senderId}-${message.sentAt}-${index}`}
            className={`message ${message.senderId === "alpha" ? "sender" : "receiver"
              }`}
          >
            <div className="message-content">
              {message.message}
              <div className="time-right">
                {new Date(message.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}


        <div ref={messageEndRef}></div>
      </div>

      <div className="input-container">
        <button className="add" onClick={() => setShowPicker((val) => !val)}>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.2188 9.71875H10.7812V1.28125C10.7812 0.849766 10.4315 0.5 10 0.5C9.56852 0.5 9.21875 0.849766 9.21875 1.28125V9.71875H0.78125C0.349766 9.71875 0 10.0685 0 10.5C0 10.9315 0.349766 11.2812 0.78125 11.2812H9.21875V19.7188C9.21875 20.1502 9.56852 20.5 10 20.5C10.4315 20.5 10.7812 20.1502 10.7812 19.7188V11.2812H19.2188C19.6502 11.2812 20 10.9315 20 10.5C20 10.0685 19.6502 9.71875 19.2188 9.71875Z"
              fill="#144322"
            />
          </svg>
        </button>

        <input
          className="text-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message"
        />

        <button className="send-button" onClick={sendMessage}>
          <img style={{width:"80%"}} src="./images/send (2).svg" alt="" />
        </button>
      </div>

      {showPicker && <Picker onEmojiClick={handleEmojiClick} />}
    </div>
  );
};

export default Chatsection;

