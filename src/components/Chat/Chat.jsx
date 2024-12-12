import React, { useState, useEffect, useContext } from "react";
import "./chat.css";
import { FaSearch } from "react-icons/fa";
import Chatsection from "./Chatsection";
import AppContext from "../AppContext";

const departments = [
  { name: 'Human Resources' },
  { name: 'Finance' },
  { name: 'Marketing' },
  { name: 'IT Support' },
  { name: 'Sales' },
];
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
        <div className="chat_saprator">
          <div className="_chat_profile_department">
            <div className="chat_user_profile_pic_div">
              <img className="chat_user_profile_pic" src="images/dp.jpg" alt="" />
            </div>
            <div className="_home_department_section">
              <div className="home_button_chat">
                <button className="_home_button">
                  <img className="chat_saprator_home_button" src="/images/home-icon.svg" alt="home-icon" />
                </button>
              </div>
              <div className="section-list-department" style={styles.list}>
                {departments.map((department, index) => (
                  <div key={index} style={styles.item}>
                    <div style={styles.icon}>
                      {department.name
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase())
                        .slice(0, 1)
                        .join('')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="home_button_chat">
                <button className="_home_button">
                  <img className="chat_saprator_home_button" src="/images/plus-icon.svg" alt="home-icon" />
                </button>
              </div>
              <div className="bottom_logout_button">
                <button className="logout_button" style={{ transform: 'rotate(180deg)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <img
                    src="./images/Logout_button.svg"
                    alt="Logout"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </button>

              </div>
            </div>

          </div>
          <div className="_chat_group_section">
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
                Group
              </div>
            </div>
            <div className="chats-user-container">
              {active === "chats" ? (
                filteredChats.length > 0 ? (
                  filteredChats.map((chatroom) => (
                    <div
                      key={chatroom.chatId}
                      className={`user-container ${chatroom.chatId === selectedChatId ? "active-chat" : ""
                        }`}
                      onClick={() => handleChatClick(chatroom.chatId)} // Handle chat selection
                    >
                      <div className="userinfo">
                        <img
                          src="images/dp.jpg"
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
const styles = {
  list: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  item: {
    display: "flex",
    flexDirection: "column", // Corrected "flex-direction" to "flexDirection"
    gap: "7px", // Changed `gap` to have quotes for the value
    alignItems: "center", // Corrected "align-items" to "alignItems"
    justifyContent: "center", // Corrected "justify-content" to "justifyContent"
    alignContent: "center", // Corrected "align-content" to "alignContent"
  },
  icon: {
    width: "40px", // Changed from invalid syntax
    height: "40px", // Changed from invalid syntax
    borderRadius: "50%", // Corrected "borderradius" to "borderRadius"
    backgroundColor: "white", // Corrected "backgroundcolor" to "backgroundColor"
    color: "black",
    display: "flex",
    alignItems: "center", // Corrected "alignitems" to "alignItems"
    justifyContent: "center", // Corrected "justifycontent" to "justifyContent"
    fontWeight: "bold", // Corrected "fontweight" to "fontWeight"
    fontSize: "24px", // Corrected "fontsize" to "fontSize"
    textTransform: "uppercase", // Corrected "texttransform" to "textTransform"
    flexDirection: "column", // Corrected "flexdirection" to "flexDirection"
  },
};

