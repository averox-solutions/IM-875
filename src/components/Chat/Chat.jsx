import React, { useState, useEffect, useContext } from "react";
import "./chat.css";
import { FaSearch } from "react-icons/fa";
import Chatsection from "./Chatsection";
import AppContext from "../AppContext";
import { GrHomeRounded } from "react-icons/gr";
import { IoAddSharp } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

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
      console.log(chatrooms);
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

        // Assuming data.users is the correct structure
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

const handleChatClick = (chatId) => {
    const selectedChat = chatrooms.find((chat) => chat.chatId === chatId);
    if (selectedChat) {
      const participantInfo = {
        participantId: selectedChat.participant.user_id,
        name: selectedChat.participant.name,
        profilePic: selectedChat.participant.profilePic,
      };
      setSelectedChatId(chatId); // Update selected chat ID
      setParticipantInfo(participantInfo); // Store participant info to pass to ChatSection
    }
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
                    fontsize: "x-large",
                    fontweight: "bolder",
                  }}
                >
                 <CiLogout />
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
    // If the user typed something, show search results in the chat container
    searchResults.length > 0 ? (
      searchResults.map((user) => (
        <div key={user.id} className="user-container">
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
    // If the input is empty
    active === "chats" ? (
      filteredChats && filteredChats.length > 0 ? (
        filteredChats.map((chatroom) => (
          <div
            key={chatroom.chatId}
            className={`user-container ${
              chatroom.chatId === selectedChatId ? "active-chat" : ""
            }`}
            onClick={() => handleChatClick(chatroom.chatId)}
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
      // If active is not "chats"
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

// import React, { useState, useEffect, useContext } from "react";
// import "./chat.css";
// import { FaSearch } from "react-icons/fa";
// import Chatsection from "./Chatsection";
// import AppContext from "../AppContext";

// const Chat = () => {
//   const { fetchChatrooms, chatrooms, chatroomsError } = useContext(AppContext);
//   const [input, setInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]); 
//   const [filteredChats, setFilteredChats] = useState([]);
//   const SERVER_URL = process.env.REACT_APP_REST_URL;
//   const token = localStorage.getItem("accessToken");

//   // Fetch chatrooms when component mounts
//   useEffect(() => {
//     const getChatrooms = async () => {
//       await fetchChatrooms();
//     };
//     getChatrooms();
//   }, [fetchChatrooms]);

//   // Update filtered chats when chatrooms data changes
//   useEffect(() => {
//     if (chatrooms) {
//       setFilteredChats(chatrooms);
//     }
//   }, [chatrooms]);

//   // Filter local chatrooms based on input if no remote search is needed
//   useEffect(() => {
//     if (chatrooms && input.trim() === "") {
//       // If input is empty, show all chatrooms
//       setFilteredChats(chatrooms);
//     } else if (chatrooms && input.trim() !== "") {
//       // If you still want local filtering even while searching:
//       const filtered = chatrooms.filter(
//         (chatroom) =>
//           chatroom.participant.name
//             .toLowerCase()
//             .includes(input.toLowerCase()) ||
//           chatroom.lastMessage.message
//             .toLowerCase()
//             .includes(input.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     }
//   }, [input, chatrooms]);

//   // Fetch users from the server when input changes (for remote search)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (input.trim() === "") {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const url = `http://localhost:8000/im/users/search?query=${encodeURIComponent(input)}`;
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           console.error("Failed to fetch search results:", response.status);
//           return;
//         }

//         const data = await response.json();
//         console.log("Fetched search data:", data);

//         // Assuming data.users is the correct structure
//         if (Array.isArray(data.users)) {
//           setSearchResults(data.users);
//         } else if (Array.isArray(data)) {
//           setSearchResults(data);
//         } else {
//           setSearchResults([]);
//         }
//       } catch (error) {
//         console.error("Error fetching user search results:", error);
//       }
//     };

//     fetchUsers();
//   }, [input, token, SERVER_URL]);

//   return (
//     <div className="search-container">
//       <div className="input-wrapper">
//         <FaSearch id="search-icon" />
//         <input
//           className="input"
//           placeholder="Type to search..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//       </div>

//       {/* 
//         Instead of showing searchResults here, we will integrate them into the main chat container.
//         So just remove the search-results div from here.
//       */}
      
//       <div className="chats-user-container">
//         {input.trim() !== "" ? (
//           // If the user typed something, show search results in the chat container
//           searchResults.length > 0 ? (
//             searchResults.map((user) => (
//               <div key={user.id} className="user-container">
//                 <div className="userinfo">
//                   <img
//                     src={user.profilePic || "images/dp.jpg"} 
//                     alt={user.username}
//                     className="profile-pic"
//                   />
//                   <div className="username">
//                     <span className="name">{user.username}</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-chat">
//               <p>No users found.</p>
//             </div>
//           )
//         ) : (
//           // If the input is empty, show the original filtered chats
//           filteredChats && filteredChats.length > 0 ? (
//             filteredChats.map((chatroom) => (
//               <div key={chatroom.chatId} className="user-container">
//                 <div className="userinfo">
//                   <img
//                     src={chatroom.participant.profilePic}
//                     alt={chatroom.participant.name}
//                     className="profile-pic"
//                   />
//                   <div className="username">
//                     <span className="name">{chatroom.participant.name}</span>
//                     <div className="text-container">
//                       <span className="last-message">
//                         {chatroom.lastMessage.message}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="time">
//                   <span>{chatroom.lastMessage.sentAt}</span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-chat">
//               <p>No chats available</p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;

