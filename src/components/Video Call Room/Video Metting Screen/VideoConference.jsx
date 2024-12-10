// import React, { useEffect, useRef, useState } from "react";
// import "./VideoConference.css";
// import VideoCall from "./VideoCall";
// import useNavigation from "./navigate";

// const VideoConference = () => {
//   const [isSearchListVisible, setIsSearchListVisible] = useState(false);
//   const [firstSearchItem, setFirstSearchItem] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const toggleSearchList = () => {
//     setIsSearchListVisible(!isSearchListVisible);
//   };

//   const handleInputChange = (e) => {
//     setFirstSearchItem(e.target.value);
//   };
//   const [activeList, setActiveList] = useState(null);

//   const toggleList = (listName) => {
//     setActiveList(activeList === listName ? null : listName);
//   };

//   const [activeView, setActiveView] = useState("video");

//   const toggleView = (view) => {
//     setActiveView(view);
//   };
//   const navigateTo = useNavigation();
//   const handleNavigation = () => {
//     navigateTo("/about");
//   };
//   const placeholderImages = [
//     "../images/Image1.png",
//     "../images/Image2.png",
//     "../images/Image3.png",
//     "../images/Image4.png",
//     "../images/Image5.png",
//     "../images/Image6.png",
//     "../images/Image7.png",
//     "../images/Image8.png",
//     "../images/Image9.png",
//     "../images/Image10.png",
//     "../images/Image11.png",
//     "../images/Image12.png",
//   ];

//   const [streams, setStreams] = useState([]);
//   const videoRefs = useRef([]);
//   const [active, setActive] = useState("chats");
//   const [micMuted, setMicMuted] = useState(false);
//   const [videoOff, setVideoOff] = useState(false);

//   const participants = [
//     { id: 1, name: "John Doe" },
//     { id: 2, name: "Jane Smith" },
//     { id: 3, name: "Alice Johnson" },
//     { id: 4, name: "Antonio" },
//     { id: 5, name: "Brayden" },
//     { id: 6, name: "Devin" },
//     { id: 7, name: "Marco" },
//   ];

//   const toggle = (option) => {
//     setActive(option);
//   };

//   const toggleMic = () => {
//     setMicMuted(!micMuted);
//   };

//   const toggleVideo = () => {
//     setVideoOff(!videoOff);
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setNewMessage("");
//     }
//   };

//   const handleInputKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="video-conference">
//       <div className="icon-container">
//         <div className="logo">
//           <img src="../../Images/beep-logo.png" alt="Beep Logo" />
//         </div>

//         <div className="use-avater">
//           {isSearchListVisible && (
//             <input
//               style={{
//                 border: "none",
//                 outline: "none",
//                 position: "absolute",
//                 right: "330px",
//                 width: "20%",
//                 height: "5vh",
//                 background: "#fbfbfb",
//                 paddingLeft: "23px",
//                 borderRadius: "10px",
//                 border: "1px solid #eeecec",
//               }}
//               type="text"
//               placeholder="Enter Search"
//               value={firstSearchItem}
//               onChange={handleInputChange}
//             />
//           )}
//           <button
//             style={{ background: "none", border: "none", outline: "none" }}
//             onClick={toggleSearchList}
//           >
//             <img
//               src="../../Images/searchIcon.png"
//               alt="Search Icon"
//               onChange={handleInputChange}
//             />
//           </button>
//           <button
//             style={{ background: "none", border: "none" }}
//             onClick={() => toggleList("dropdown")}
//           >
//             <img src="../../Images/bell-icon-nav.png" alt="Bell Icon" />
//           </button>
//           <img
//             src="../../Images/Image4.png"
//             alt="User Avatar"
//             style={{ width: "55px", height: "55px", borderRadius: "50px" }}
//           />
//           <span className="user-name">Jane Smith</span>
//         </div>

//         {activeList === "dropdown" && (
//           <div className="dropdown">
//             <div className="modal-body">
//               <h5>Notifications</h5>
//               <p>This triggers a popover on click.</p>
//               <p>Have tooltips on hover.</p>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="container banner">
//         <div className="videoCalling">
//           <VideoCall />
//         </div>

//         <div className="chat-panel-func">
//           <div className="chat-panel">
//             <div className="chat-button">
//               <button
//                 className={`toggle ${active === "chat" ? "active" : ""}`}
//                 onClick={() => toggle("chat")}
//                 type="button"
//                 role="tab"
//                 style={{
//                   borderBottomLeftRadius: "20px",
//                   borderTopLeftRadius: "20px",
//                 }}
//               >
//                 Chat
//               </button>

//               <button
//                 className={`toggle ${active === "participants" ? "active" : ""
//                   }`}
//                 onClick={() => toggle("participants")}
//                 type="button"
//                 role="tab"
//                 style={{
//                   borderBottomRightRadius: "20px",
//                   borderTopRightRadius: "20px",
//                 }}
//               >
//                 Participants
//               </button>
//             </div>
//             {active === "chat" ? (
//               <div className="chat-body">
//                 <div className="empt">
//                   <img src="../../Images/Chat-Empty.png" alt="Chat is empty" />
//                 </div>

//                 <h5 className="conversion">Start a conversation</h5>
//                 <span className="chat-placeholder">
//                   There are no messages here yet. Start a conversation by
//                   sending a message.
//                 </span>
//                 <div className="messages-container">
//                   {messages.map((message, index) => (
//                     <div key={index} className="message">
//                       {message}
//                     </div>
//                   ))}
//                   <div className="chat-body-end">
//                     <span>To</span>
//                     <div className="chat-body-end-Htag">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         height="24px"
//                         viewBox="0 -960 960 960"
//                         width="24px"
//                         fill="#5f6368"
//                         onClick={toggleVideo}
//                         color={videoOff ? "secondary" : "default"}
//                       >
//                         <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
//                       </svg>
//                       <span>Everyone</span>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         height="24px"
//                         viewBox="0 -960 960 960"
//                         width="24px"
//                         fill="#5f6368"
//                         onClick={toggleMic}
//                         color={micMuted ? "secondary" : "default"}
//                       >
//                         <path d="M504-480L320-664l56-56 240 240-240 240-56-56 184-184Z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="chat-footer">
//                   <input
//                     type="text"
//                     name="search"
//                     placeholder="Send a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={handleInputKeyPress}
//                   />
//                   <img
//                     onClick={handleSendMessage}
//                     className="chat-footer-search-text-send"
//                     src="./images/send.png"
//                     alt="Send"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="participants-body">
//                 <span className="Participant-heading">Participants List</span>
//                 <div className="participant-list">
//                   {participants.map((participant) => (
//                     <span className="name-id" key={participant.id}>
//                       {participant.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="footer">
//         <div className="footer-left-content">
//           <p>08:53 | Security Conference</p>
//         </div>
//         <div className="icons-bar">{/* SVG icons go here */}</div>
//         <div className="footer-right-content">
//           {/* Additional footer SVG icons */}
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default VideoConference;





import React, { useEffect, useRef, useState } from "react";
import "./VideoConference.css";
import VideoCall from "./VideoCall";
import useNavigation from "./navigate";
import { IoIosCopy } from "react-icons/io";



const VideoConference = (props) => {
  const {
    room_id,
    username,
    localVideoRef,
    isVideoMuted,
    isAudioMuted,
    sendMessage,
    toggleVideoMute,
    toggleAudioMute,
    peers,
    handleLeaveRoom,
  } = props

  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [firstSearchItem, setFirstSearchItem] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const toggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  const handleInputChange = (e) => {
    setFirstSearchItem(e.target.value);
  };
  const [activeList, setActiveList] = useState(null);

  const toggleList = (listName) => {
    setActiveList(activeList === listName ? null : listName);
  };

  const [activeView, setActiveView] = useState("video");

  const toggleView = (view) => {
    setActiveView(view);
  };
  const navigateTo = useNavigation();
  const handleNavigation = () => {
    navigateTo("/about");
  };
  const placeholderImages = [
    "../images/Image1.png",
    "../images/Image2.png",
    "../images/Image3.png",
    "../images/Image4.png",
    "../images/Image5.png",
    "../images/Image6.png",
    "../images/Image7.png",
    "../images/Image8.png",
    "../images/Image9.png",
    "../images/Image10.png",
    "../images/Image11.png",
    "../images/Image12.png",
  ];

  const [streams, setStreams] = useState([]);
  const videoRefs = useRef([]);
  const [active, setActive] = useState("chats");
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const participants = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Antonio" },
    { id: 5, name: "Brayden" },
    { id: 6, name: "Devin" },
    { id: 7, name: "Marco" },
  ];

  const toggle = (option) => {
    setActive(option);
  };

  const toggleMic = () => {
    setMicMuted(!micMuted);
  };

  const toggleVideo = () => {
    setVideoOff(!videoOff);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="video-conference">
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} className="icon-container">
        <div className="logo">
          <img src="../../Images/beep-logo.png" alt="Beep Logo" />
        </div>

        <div className="use-avater">
          {isSearchListVisible && (
            <input
              style={{
                border: "none",
                outline: "none",
                position: "absolute",
                right: "330px",
                width: "20%",
                height: "5vh",
                background: "#fbfbfb",
                paddingLeft: "23px",
                borderRadius: "10px",
                border: "1px solid #eeecec",
              }}
              type="text"
              placeholder="Enter Search"
              value={firstSearchItem}
              onChange={handleInputChange}
            />
          )}
          <button
            style={{ background: "none", border: "none", outline: "none" }}
            onClick={toggleSearchList}
          >
            <img
              src="../../Images/searchIcon.png"
              alt="Search Icon"
              onChange={handleInputChange}
            />
          </button>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => toggleList("dropdown")}
          >
            <img src="../../Images/bell-icon-nav.png" alt="Bell Icon" />
          </button>
          <div onClick={() => {
            const currentUrl = window.location.href; // Get the current browser URL
            navigator.clipboard
              .writeText(currentUrl) // Copy the URL to the clipboard
              .then(() => {
                alert("Copied!"); // Alert the user
              })
              .catch((err) => {
                console.error("Failed to copy: ", err);
              });
          }}>
            <IoIosCopy style={{ fontSize: "24px", minWidth: "24px" }} />
          </div>
          <img
            src="../../Images/Image4.png"
            alt="User Avatar"
            style={{ width: "55px", height: "55px", borderRadius: "50px" }}
          />
          <span className="user-name">Jane Smith</span>
        </div>

        {activeList === "dropdown" && (
          <div className="dropdown">
            <div className="modal-body">
              <h5>Notifications</h5>
              <p>This triggers a popover on click.</p>
              <p>Have tooltips on hover.</p>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }} className="container banner">
        <div style={{ height: "100%" }} className="videoCalling">
          <VideoCall
            room_id={room_id}
            username={username}
            localVideoRef={localVideoRef}
            isVideoMuted={isVideoMuted}
            isAudioMuted={isAudioMuted}
            sendMessage={sendMessage}
            toggleVideoMute={toggleVideoMute}
            toggleAudioMute={toggleAudioMute}
            peers={peers}
            handleLeaveRoom={handleLeaveRoom}
          />
        </div>

        <div className="chat-panel-func">
          <div className="chat-panel">
            <div className="chat-button">
              <button
                className={`toggle ${active === "chat" ? "active" : ""}`}
                onClick={() => toggle("chat")}
                type="button"
                role="tab"
                style={{
                  borderBottomLeftRadius: "20px",
                  borderTopLeftRadius: "20px",
                }}
              >
                Chat
              </button>

              <button
                className={`toggle ${active === "participants" ? "active" : ""
                  }`}
                onClick={() => toggle("participants")}
                type="button"
                role="tab"
                style={{
                  borderBottomRightRadius: "20px",
                  borderTopRightRadius: "20px",
                }}
              >
                Participants
              </button>
            </div>
            {active === "chat" ? (
              <div className="chat-body">
                <div className="empt">
                  <img src="../../Images/Chat-Empty.png" alt="Chat is empty" />
                </div>

                <h5 className="conversion">Start a conversation</h5>
                <span className="chat-placeholder">
                  There are no messages here yet. Start a conversation by
                  sending a message.
                </span>
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className="message">
                      {message}
                    </div>
                  ))}
                  <div className="chat-body-end">
                    <span>To</span>
                    <div className="chat-body-end-Htag">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#5f6368"
                        onClick={toggleVideo}
                        color={videoOff ? "secondary" : "default"}
                      >
                        <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                      </svg>
                      <span>Everyone</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#5f6368"
                        onClick={toggleMic}
                        color={micMuted ? "secondary" : "default"}
                      >
                        <path d="M504-480L320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="chat-footer">
                  <input
                    type="text"
                    name="search"
                    placeholder="Send a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleInputKeyPress}
                  />
                  <img
                    onClick={handleSendMessage}
                    className="chat-footer-search-text-send"
                    src="./images/send.png"
                    alt="Send"
                  />
                </div>
              </div>
            ) : (
              <div className="participants-body">
                <span className="Participant-heading">Participants List</span>
                <div className="participant-list">
                  <span className="name-id">
                    {username}
                  </span>
                  {peers?.map((data, index) => {

                    return (
                      <span className="name-id" key={index}>
                        {data.username}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left-content">
          <p>08:53 | Security Conference</p>
        </div>
        <div className="icons-bar">{/* SVG icons go here */}</div>
        <div className="footer-right-content">
          {/* Additional footer SVG icons */}
        </div>
      </footer>
    </div>
  );
};

export default VideoConference;
