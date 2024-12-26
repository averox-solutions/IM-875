import React, { useState, useEffect, useContext } from "react";
import "./chat.css";
import { FaSearch } from "react-icons/fa";
import Chatsection from "./Chatsection";
import AppContext from "../AppContext";
import { GrHomeRounded } from "react-icons/gr";
import { IoAddSharp } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { TbLogout } from "react-icons/tb";

const departments = [
  { name: 'Human Resources' },
  { name: 'Finance' },
  { name: 'Marketing' },
  { name: 'IT Support' },
  { name: 'Sales' },
];
const Chat = () => {
  const { fetchChatrooms, chatrooms, chatroomsError } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [active, setActive] = useState("chats");
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); // Store the selected chatroom's ID
  const [userInfo, setUserInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [searchResults, setSearchResults] = useState([]); 
  
  const token=localStorage.getItem("accessToken");

  // Fetch chatrooms when the component mounts
  useEffect(() => {
    const getChatrooms = async () => {
      await fetchChatrooms();
    };
    getChatrooms();
  }, [fetchChatrooms,chatrooms]);

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

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (input.trim() === "") {
        setSearchResults([]);
        return;
      }
  
      try {
        const url = `http://localhost:8000/im/users/search?query=${encodeURIComponent(input)}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error("Failed to fetch search results:", response.status);
          return;
        }
  
        const data = await response.json();
        console.log("Fetched search data:", data);
  
        if (Array.isArray(data.users)) {
          setSearchResults(data.users);
        } else if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching user search results:", error);
      }
    };
  
    fetchUsers();
  }, [input, token]);
  

  const handleToggle = (option) => {
    setActive(option);
  };

  const handleSearchClick = (user) => {
    console.log("Search result clicked:", user);
    initiateChat(user);
  };
  
  // Handle chat click
  const handleChatClick = (chatId) => {
    console.log(chatId)
    const selectedChat = chatrooms.find((chat) => chat.chatId === chatId);
    if (selectedChat) {
      const participantInfo = {
        participantId: selectedChat.participant.user_id,
        name: selectedChat.participant.name,
        profilePic: selectedChat.participant.profilePic,
      };
      setSelectedChatId(chatId);
      setParticipantInfo(participantInfo);
      console.log("Selected Chat:", selectedChat);
    } else {
      console.warn("Chat not found. Opening new chat...");
    }
  };
  //function to start a chat
  const initiateChat = (participant) => {
    // Find the chatroom by matching participantId
    const selectedChat = chatrooms.find(
      (chat) => chat.participant.user_id === participant.participantId
    );
  
    if (selectedChat) {
      const participantInfo = {
        participantId: selectedChat.participant.user_id,
        name: selectedChat.participant.name,
        profilePic: selectedChat.participant.profilePic,
      };
      setSelectedChatId(selectedChat.chatId);  // Set the chat ID to navigate
      setParticipantInfo(participantInfo);
      console.log("Selected Chat:", selectedChat);
    } else {
      console.warn("Chat not found. Opening new chat...");
  
      // Create new participant info if no existing chat
      const participantInfo = {
        participantId: participant.participantId,
        name: participant.username,
        profilePic: participant.profilePic || "images/dp.jpg",
      };
  
      // Simulate a new chatId (Temporary until chat is created)
      const tempChatId = `new_${participant.participantId}`;
  
      // Set the chat ID to open the chat section
      setSelectedChatId(tempChatId);
      setParticipantInfo(participantInfo);
  
      openNewChat(participantInfo);
    }
  };
  // Example function to handle new chat creation
  const openNewChat = (participant) => {
    // Implement API call or UI logic to create/initiate a new chat
    console.log("Creating new chat with:", participant);
  };
  

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage
    sessionStorage.clear();
    // Clear cookies (optional, depending on your cookie settings)
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie.trim().split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    });
    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="Container">
      <div className="nav-left">
        <div className="chat_saprator">
          <div className="_chat_profile_department">
            <div className="chat_user_profile_pic_div">
              <img
                className="chat_user_profile_pic"
                src={userInfo ? userInfo.profilePic : "images/dp.jpg"}
                alt="Profile"
              />
            </div>
            <div className="_home_department_section">
              <div className="home_button_chat">
                <button className="_home_button">
                <GrHomeRounded />
                </button>
              </div>
              <div className="section-list-department" style={styles.list}>
                {departments.map((department, index) => (
                  <div key={index} style={styles.item}>
                    <div style={styles.icon}>
                      {department.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .slice(0, 1)
                        .join("")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="home_button_chat">
                <button className="_home_button">
                <IoAddSharp />
                </button>
              </div>
              <div className="bottom_logout_button">
                <button
                  className="logout_button"
                  onClick={handleLogout}
                  style={{
                    transform: "rotate(180deg)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontsize: "xlarge",
                    fontweight: "bolder",
                  }}
                >
                <TbLogout />
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
  {input.trim() !== "" ? (
    // Display search results when there is input
    searchResults.length > 0 ? (
      searchResults.map((user) => (
        <div
          key={user.id}
          className="user-container"
          onClick={() => handleSearchClick(user)}  // Call new handler for search
        >
          <div className="userinfo">
            <img
              src={user.profilePic || "images/dp.jpg"}
              alt={user.username}
              className="profile-pic"
            />
            <div className="username">
              <span className="name">{user.username}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="no-chat">
        <p>No users found.</p>
      </div>
    )
  ) : (
    // Display chatrooms when input is empty
    active === "chats" ? (
      filteredChats && filteredChats.length > 0 ? (
        filteredChats.map((chatroom) => (
          <div
            key={chatroom.chatId}
            className={`user-container ${
              chatroom.chatId === selectedChatId ? "active-chat" : ""
            }`}
            onClick={() => handleChatClick(chatroom.chatId)}  // Call existing handler
          >
            <div className="userinfo">
              <img
                src={chatroom.participant.profilePic}
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
    )
  )}
</div>


          </div>
        </div>
      </div>
      <div className="nav-right">
        {selectedChatId ? (
          <Chatsection
            participantInfo={participantInfo}
            currentUserInfo={userInfo}
          />
        ) : (
          <div className="placeholder">
            <div className="no-chat">
              <img
                // src="https://averox.com/wp-content/uploads/2024/09/beep.png"
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
    width: "30px", // Changed from invalid syntax
    height: "30px", // Changed from invalid syntax
    borderRadius: "50%", // Corrected "borderradius" to "borderRadius"
    backgroundColor: "#ffecec", // Corrected "backgroundcolor" to "backgroundColor"
    color: "black",
    display: "flex",
    alignItems: "center", // Corrected "alignitems" to "alignItems"
    justifyContent: "center", // Corrected "justifycontent" to "justifyContent"
    fontWeight: "600", // Corrected "fontweight" to "fontWeight"
    fontSize: "20px", // Corrected "fontsize" to "fontSize"
    textTransform: "uppercase", // Corrected "texttransform" to "textTransform"
    flexDirection: "column",
  },
};
