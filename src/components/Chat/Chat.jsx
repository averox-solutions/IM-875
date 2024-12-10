import React, { useState, useEffect, useContext } from "react";
import "./chat.css";
import { FaSearch } from "react-icons/fa";
import Chatsection from "./Chatsection";
import AppContext from "../AppContext";


const Chat = () => {
  const { fetchChatrooms, chatrooms, chatroomsError, messages } =
    useContext(AppContext);
  const [input, setInput] = useState("");
  const [active, setActive] = useState("chats");
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); // Store the selected chatroom's ID

  // Fetch chatrooms when the component mounts
  useEffect(() => {
    const getChatrooms = async () => {
      await fetchChatrooms();
    };
    getChatrooms();
  }, [fetchChatrooms]);

  // Update filtered chats when chatrooms data changes
  useEffect(() => {
    if (chatrooms) {
      setFilteredChats(chatrooms);
    }
  }, [chatrooms]);

  // Handle chatrooms error
  useEffect(() => {
    if (chatroomsError) {
      console.error("Chatrooms Error:", chatroomsError);
    }
  }, [chatroomsError]);

  // Filter chatrooms based on search input
  useEffect(() => {
    const filtered = chatrooms.filter(
      (chatroom) =>
        chatroom.participant.name
          .toLowerCase()
          .includes(input.toLowerCase()) ||
        chatroom.lastMessage.message
          .toLowerCase()
          .includes(input.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [input, chatrooms]);

  const handleToggle = (option) => {
    setActive(option);
  };

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId); // Update the selected chat ID
  };
  const cleanProfilePicUrl = (url) => {
    const prefixToRemove = 'https://localhost:8000/';
    return url.startsWith(prefixToRemove) ? url.replace(prefixToRemove, '') : url;
  };

  return (
    <div className="Container">
      <div className="nav-left">
        <div className="search-container">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              className="input"
              placeholder="Type to search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <div className="toggle-container">
          <div
            className={`toggle-option ${active === "chats" ? "active" : ""}`}
            onClick={() => handleToggle("chats")}
          >
            Chats
          </div>
          <div
            className={`toggle-option ${active === "zones" ? "active" : ""}`}
            onClick={() => handleToggle("zones")}
          >
            Zones
          </div>
        </div>
        <div className="chats-user-container">
          {active === "chats" ? (
            filteredChats.length > 0 ? (
              filteredChats.map((chatroom) => (
                <div
                  key={chatroom.chatId}
                  className={`user-container ${
                    chatroom.chatId === selectedChatId ? "active-chat" : ""
                  }`}
                  onClick={() => handleChatClick(chatroom.chatId)} // Handle chat selection
                >
                  <div className="userinfo">
                  <img
                     src={cleanProfilePicUrl(chatroom.participant.profilePic)}
                     alt={chatroom.participant.name}
                     className="profile-pic"
                     />
                    <div className="username">
                      <span className="name">{chatroom.participant.name}</span>
                      <div className="text-container">
                        <span className="last-message">
                          {chatroom.lastMessage.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="time">
                    <span>{chatroom.lastMessage.sentAt}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-chat">
                <img
                  src="./images/illustration.svg"
                  className="img-right"
                  alt=""
                />
                <p>No chats available</p>
              </div>
            )
          ) : (
            <div className="no-chat">
              <img
                src="./images/illustration.svg"
                className="img-right"
                alt=""
              />

            </div>
          )}
        </div>
      </div>
      <div className="nav-right">
        {selectedChatId ? (
          <Chatsection chatroomId={selectedChatId} /> // Pass selected chatroomId to Chatsection
        ) : (
          <div className="placeholder">
            <div className="no-chat">
              <img
                src="https://averox.com/wp-content/uploads/2024/09/beep.png"
                className="img-right"
                alt=""
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
