// import React, { useState, useEffect, useRef } from "react";
// import Picker from "emoji-picker-react";
// import {
//   FaSearch,
//   FaVideo,
//   FaPhone,
//   FaEllipsisV,
//   FaPlay,
//   FaPause,
//   FaVolumeUp,
// } from "react-icons/fa";
// import "./Chatsection.css";
// import io from "socket.io-client";

// const SERVER_URL = "http://localhost:8080";
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI5Njc0MDRmMjEzZWJmZDVmYjAyOCIsImVtYWlsIjoiYWxwaGFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbHBoYSIsImlhdCI6MTczMzcyMzIyMCwiZXhwIjoxNzMzODA5NjIwfQ.rUn9mR_rj-Q4Iy5Hre8jcMLnhvLhTY1i_CAR16AXCFc";

// const Chatsection = ({ selectedChatId }) => {
//   const [socket, setSocket] = useState(null);
//   const [activeConversationId, setActiveConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [showPicker, setShowPicker] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     // Initialize socket connection
//     console.log(selectedChatId)
//     const socketConnection = io(`${SERVER_URL}/im`, { query: { token } });
//     setSocket(socketConnection);

//     // Handle socket events
//     socketConnection.on("connect", () => {
//       console.log("Connected to socket server.");
//       const participantId = "6752968504f213ebfd5fb02c"; // Beta's user ID

//       // Check conversation
//       socketConnection.emit("checkConversation", { participantId });
//       socketConnection.on("conversationCheckResponse", (data) => {
//         if (data.exists) {
//           setActiveConversationId(data.conversationId);
//           setMessages(data.messages || []);
//           socketConnection.emit("joinRoom", data.conversationId);
//         } else {
//           socketConnection.emit("createConversation", { participantId });
//         }
//       });

//       // Handle new conversation creation
//       socketConnection.on("chatRoomCreated", (conversationId) => {
//         setActiveConversationId(conversationId);
//         socketConnection.emit("joinRoom", conversationId);
//       });

//       // Handle incoming messages
//       socketConnection.on("receiveMessage", (msg) => {
//         setMessages((prev) => [...prev, msg]);
//         socketConnection.emit("isDelivered", msg.messageId);
//         socketConnection.emit("markAsSeen", msg.messageId);
//       });

//       // Handle typing events
//       socketConnection.on("Typing", () => setIsTyping(true));
//       socketConnection.on("stopTyping", () => setIsTyping(false));
//     });

//     socketConnection.on("disconnect", (reason) => {
//       console.log(`Disconnected: ${reason}`);
//     });

//     return () => {
//       socketConnection.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (activeConversationId && inputValue.trim()) {
//       const messagePayload = {
//         conversationId: activeConversationId,
//         message: inputValue,
//       };

//       // Emit message to server
//       socket.emit("sendMessage", messagePayload, (response) => {
//         if (response.error) {
//           console.error("Failed to send message:", response.error);
//         } else {
//           console.log("Message sent successfully:", response);
//           setMessages((prev) => [
//             ...prev,
//             {
//               senderId: "alpha",
//               message: inputValue,
//               sentAt: new Date().toISOString(),
//             },
//           ]);
//           setInputValue("");
//         }
//       });
//     }
//   };

//   const handleTyping = () => {
//     if (activeConversationId) {
//       socket.emit("typing", activeConversationId);
//     }
//   };

//   const handleEmojiClick = (emojiData) => {
//     setInputValue(inputValue + emojiData.emoji);
//   };

//   return (
//     <div className="Container-right">
//       <div className="navbar-right">
//         <div className="logo">
//           <img
//             className="logo-img-chat"
//             src="profilePicUrl" // Replace with actual image URL
//             alt="logo"
//           />
//           <div className="name-container">
//             <span className="name-right">Chat</span> {/* Replace with dynamic name */}
//           </div>
//         </div>
//         <div className="icon-container">
//           <div className="icons">
//             <FaPhone className="icon-size" />
//           </div>
//           <div className="icons">
//             <FaVideo className="icon-size" />
//           </div>
//           <div className="icons">
//             <FaSearch className="icon-size" />
//           </div>
//           <div className="icons">
//             <FaEllipsisV className="icon-size" />
//           </div>
//         </div>
//       </div>

//       <div className="chatsection">
//         <div className="crpto-container">
//           <span className="encrypt-text">
//             🔒 Messages and calls are end-to-end encrypted.
//           </span>
//         </div>

//         {messages.map((message, index) => (
//           <div
//             key={`${message.senderId}-${message.sentAt}-${index}`}
//             className={`message ${message.senderId === "alpha" ? "sender" : "receiver"
//               }`}
//           >
//             <div className="message-content">
//               {message.message}
//               <div className="time-right">
//                 {new Date(message.sentAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           </div>
//         ))}


//         <div ref={messageEndRef}></div>
//       </div>

//       <div className="input-container">
//         <button className="add" onClick={() => setShowPicker((val) => !val)}>
//           <svg
//             width="20"
//             height="21"
//             viewBox="0 0 20 21"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M19.2188 9.71875H10.7812V1.28125C10.7812 0.849766 10.4315 0.5 10 0.5C9.56852 0.5 9.21875 0.849766 9.21875 1.28125V9.71875H0.78125C0.349766 9.71875 0 10.0685 0 10.5C0 10.9315 0.349766 11.2812 0.78125 11.2812H9.21875V19.7188C9.21875 20.1502 9.56852 20.5 10 20.5C10.4315 20.5 10.7812 20.1502 10.7812 19.7188V11.2812H19.2188C19.6502 11.2812 20 10.9315 20 10.5C20 10.0685 19.6502 9.71875 19.2188 9.71875Z"
//               fill="#144322"
//             />
//           </svg>
//         </button>

//         <input
//           className="text-input"
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleTyping}
//           placeholder="Type a message"
//         />

//         <button className="send-button" onClick={sendMessage}>
//           <img style={{width:"80%"}} src="./images/send (2).svg" alt="" />
//         </button>
//       </div>

//       {showPicker && <Picker onEmojiClick={handleEmojiClick} />}
//     </div>
//   );
// };

// export default Chatsection;

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';
const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI5Njc0MDRmMjEzZWJmZDVmYjAyOCIsImVtYWlsIjoiYWxwaGFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbHBoYSIsImlhdCI6MTczMzkxMjMwMiwiZXhwIjoxNzMzOTk4NzAyfQ.IQQDu23OYE0CTSQdlRa63IE2opHde3WfMJsfYuMcB9Y';

const ChatSection = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [offset, setOffset] = useState(0);
    const [showPicker, setShowPicker] = useState(false);
    const chatRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const alphaId = '6752967404f213ebfd5fb028'; // Alpha's user ID
    const betaId = '6752968504f213ebfd5fb02c'; // Beta's user ID
    const PAGE_SIZE = 20;

    useEffect(() => {
        const newSocket = io(`${SERVER_URL}/im`, { query: { token } });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('checkConversation', { participantId: betaId });
        });

        newSocket.on('conversationCheckResponse', (data) => {
            if (data.exists) {
                setActiveConversationId(data.conversationId);
                setMessages(data.messages || []);
                setOffset(Math.max(0, (data.messages.length || 0) - PAGE_SIZE));
                setVisibleMessages(data.messages?.slice(-PAGE_SIZE) || []);
                setFilteredMessages(data.messages?.slice(-PAGE_SIZE) || []);
                newSocket.emit('joinRoom', data.conversationId);
            } else {
                newSocket.emit('createConversation', { participantId: betaId });
            }
        });

        newSocket.on('chatRoomCreated', (conversationId) => {
            setActiveConversationId(conversationId);
            newSocket.emit('joinRoom', conversationId);
        });

        newSocket.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setVisibleMessages((prevVisible) => [...prevVisible, msg]);
            setFilteredMessages((prevFiltered) => [...prevFiltered, msg]);
            newSocket.emit('isDelivered', msg.messageId);
            newSocket.emit('markAsSeen', msg.messageId);
        });

        newSocket.on('Typing', () => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [filteredMessages]);

    const sendMessage = () => {
        if (activeConversationId && message.trim()) {
            const newMessage = {
                senderId: alphaId,
                message,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
                sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            socket.emit('sendMessage', { conversationId: activeConversationId, message });
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setVisibleMessages((prevVisible) => [...prevVisible, newMessage]);
            setFilteredMessages((prevFiltered) => [...prevFiltered, newMessage]);
            setMessage('');
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleTyping = () => {
        if (activeConversationId) {
            socket.emit('typing', activeConversationId);
        }
    };

    const handleScroll = () => {
        if (chatRef.current.scrollTop === 0 && offset > 0) {
            const newOffset = Math.max(0, offset - PAGE_SIZE);
            const additionalMessages = messages.slice(newOffset, offset);
            setVisibleMessages((prevVisible) => [...additionalMessages, ...prevVisible]);
            setFilteredMessages((prevFiltered) => [...additionalMessages, ...prevFiltered]);
            setOffset(newOffset);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase().trim();
        setSearchQuery(query);

        if (query === '') {
            setFilteredMessages(visibleMessages);
        } else {
            setFilteredMessages(
                visibleMessages.filter(
                    (msg) =>
                        (msg.message && msg.message.toLowerCase().includes(query)) ||
                        (msg.senderId && msg.senderId.toLowerCase().includes(query))
                )
            );
        }
    };

    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const renderMessages = () => {
        let lastDate = null;

        return filteredMessages.map((msg, index) => {
            const currentDate = msg.date;
            const showDateHeader = currentDate !== lastDate;
            lastDate = currentDate;

            const isAlpha = msg.senderId === alphaId;
            const senderName = isAlpha ? 'Alpha' : 'Beta';
            const alignment = isAlpha ? 'flex-end' : 'flex-start';
            const backgroundColor = isAlpha ? '#CEF6DB' : '#ffffff';
            const textColor = isAlpha ? 'black' : 'black';

            return (
                <React.Fragment key={index}>
                    {showDateHeader && (
                        <div style={{ textAlign: 'center', margin: '10px 0', fontWeight: 'bold' }}>
                            {currentDate}
                        </div>
                    )}
                    <div
                        style={{
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: alignment,
                            padding: "0% 1% 0% 1"
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '70%',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor,
                                color: textColor,
                            }}
                        >
                            <strong>{senderName}:</strong>
                            {highlightText(msg.message, searchQuery)}
                            <br />
                            <small>{msg.sentAt}</small>
                        </div>
                    </div>
                </React.Fragment>
            );
        });
    };

    return (
        <div style={{ maxWidth: '100%', fontFamily: 'poppins' }}>


            <div style={{
                padding: '1%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {/* <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search messages"
                    style={{
                        width: '99%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                /> */}
                <div className="profile-pic">
                    <img
                        style={{
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            flexWrap: 'nowrap',
                            flexDirection: 'column',
                            borderRadius: '38px',
                        }}
                        src="images/dp.jpg" alt="" />
                </div>
                <button style={{
                    width: '4%',
                    backgroundColor: 'inherit',
                    border: 'none',
                }}
                >
                    <img style={{width:"65%"}} src="/images/search.svg" alt="" />
                </button>
            </div>

            <div
                ref={chatRef}
                onScroll={handleScroll}
                style={{
                    maxHeight: '572px',
                    overflowY: 'auto', // Enable scrolling only when necessary
                    backgroundColor: 'cornsilk', // Soft off-white background
                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                    padding: '15px', // Padding for content spacing
                    scrollbarWidth: 'none', // Hides scrollbar in Firefox
                    msOverflowStyle: 'none', // Hides scrollbar in IE/Edge
                    border: "none"
                }}
            >
                {renderMessages()}
                {isTyping && <div><em>Beta is typing...</em></div>}
            </div>

            <div className="input-container" style={{
                background: '#F0F2F5',
                placeContent: 'center space-between',
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
                alignContent: 'center',
                justifyContent: 'space-around',
                height: '63px',
            }}>
                <button className="add" onClick={() => setShowPicker((val) => !val)} style={{
                    marginRight: '10px',
                    border: 'none',
                    background: '#F0F2F5',
                    fontSize: '2em',
                }}>
                    +
                </button>
                <input
                    className="text-input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    placeholder="Type a message"
                    style={{
                        flexGrow: 1,
                        padding: '11px',
                        border: 'none',
                        borderRadius: '15px',

                    }}
                />
                <button className="send-button" onClick={sendMessage} style={{
                    margin: '1%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'initial',
                    border: 'none',
                    width: "5%"
                }}>
                    <img src="/images/send (2).svg" style={{ width: "55%" }} alt="" />
                </button>
            </div>
        </div>
    );
};

export default ChatSection;


