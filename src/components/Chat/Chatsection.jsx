import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { IoCallSharp } from "react-icons/io5";
import { MdVideoCall } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoMdSend, IoMdAttach } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import ZegoExpressEngine from 'zego-express-engine-webrtc';



const SERVER_URL = process.env.REACT_APP_SOCKET_URL;
const token = localStorage.getItem("accessToken");
const ChatSection = ({ participantInfo, currentUserInfo }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [offset, setOffset] = useState(0);
    const [file, setFile] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const chatRef = useRef(null);
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false); 
    const alphaId = currentUserInfo.currentUserId;
    const betaId = participantInfo.participantId;
    
    const PAGE_SIZE = 20;
    useEffect(() => {
        if (!betaId) return;  // Prevent running if betaId is not set
    
        const newSocket = io(`${SERVER_URL}/im`, { query: { token } });
        setSocket(newSocket);  // Store the socket connection
    
        // Socket connection established
        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('checkConversation', { participantId: betaId });
        });
    
        // Handle existing conversation or create a new one
        const handleConversationResponse = (data) => {
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
        };
    
        // Room created event
        const handleChatRoomCreated = (conversationId) => {
            setActiveConversationId(conversationId);
            newSocket.emit('joinRoom', conversationId);
        };
    
        // Message received event
        const handleReceiveMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setVisibleMessages((prevVisible) => [...prevVisible, msg]);
            setFilteredMessages((prevFiltered) => [...prevFiltered, msg]);
            newSocket.emit('isDelivered', msg.messageId);
            newSocket.emit('markAsSeen', msg.messageId);
        };
    
        // Typing event
        const handleTyping = () => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        };
    
        // Register socket listeners
        newSocket.on('conversationCheckResponse', handleConversationResponse);
        newSocket.on('chatRoomCreated', handleChatRoomCreated);
        newSocket.on('receiveMessage', handleReceiveMessage);
        newSocket.on('Typing', handleTyping);
    
        // Cleanup function
        return () => {
            if (newSocket) {
                newSocket.off('conversationCheckResponse', handleConversationResponse);
                newSocket.off('chatRoomCreated', handleChatRoomCreated);
                newSocket.off('receiveMessage', handleReceiveMessage);
                newSocket.off('Typing', handleTyping);
                newSocket.disconnect();  // Disconnect old socket before reconnecting
            }
        };
    }, [betaId]);  // Refresh socket on betaId change
    
    const handleSearchClick = () => {
        setOverlayVisible(true); // Show the overlay
    };
    const onEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setShowPicker(false);
    };

    const closeOverlay = () => {
        setOverlayVisible(false); // Hide the overlay
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


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

            // Emit the message to the server
            socket.emit('sendMessage', { conversationId: activeConversationId, message });

            // Update the local state for the sent message
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setVisibleMessages((prevVisible) => [...prevVisible, newMessage]);
            setFilteredMessages((prevFiltered) => [...prevFiltered, newMessage]);

            // Clear the input field
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


        const handleMessageClick = (messageId) => {
            setSelectedMessageId(messageId === selectedMessageId ? null : messageId);
        };

        const handleDeleteMessage = (messageId) => {

            console.log(`Deleting message with ID: ${messageId}`);
        };

        let lastDate = null;

        return filteredMessages.map((msg, index) => {
            const currentDate = msg.date;
            const showDateHeader = currentDate !== lastDate;
            lastDate = currentDate;

            const isAlpha = msg.senderId === alphaId;
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
                            onClick={() => handleMessageClick(msg.id)}
                            style={{
                                maxWidth: '70%',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor,
                                color: textColor,
                                minWidth: "10%",
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            {highlightText(msg.message, searchQuery)}

                            <br />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                alignContent: 'center'
                            }}>
                                <small>{msg.sentAt}</small>
                            </div>

                            {selectedMessageId === msg.id && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-30px',
                                        right: '0',
                                        backgroundColor: '#ff4d4d',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent click event
                                        handleDeleteMessage(msg.id);
                                    }}
                                >
                                    Delete
                                </div>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            );
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };


    useEffect(() => {
        if (isTyping) {
            console.log("User is typing...");
        }
    }, [isTyping]);

    return (
        <div style={{ maxWidth: '100%', fontFamily: 'poppins' }}>
            <div>
                {/* Header Section */}
                <div
                    style={{
                        padding: '1%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        gap: '873px'
                    }}
                >
                    <div className="profile-pic">
                        <div
                            style={{
                                display: "flex",
                                alignContent: "center",
                                alignItems: "center",
                                gap: "12px",
                                fontFamily: "cursive",
                            }}
                        >
                            <img
                                style={{
                                    display: "flex",
                                    alignContent: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    flexWrap: "nowrap",
                                    flexDirection: "column",
                                    borderRadius: "38px",
                                }}
                                src={participantInfo.profilePic}
                                alt="profile"
                            />
                            <span>{participantInfo.name}</span>
                        </div>
                    </div>
                    <div className="addons-class" style={{
                        display: "flex",
                        aligncontent: "center",
                        justifycontent: "center",
                        alignitems: "center",
                        fontsize: "smaller",
                    }}>
                        <button
                            style={{
                                width: "25%",
                                backgroundColor: "inherit",
                                border: "none",
                                fontSize: "x-large"
                                
                            }}
                            onClick={handleSearchClick}
                        >
                            <MdVideoCall />
                        </button>
                        <button
                            style={{
                                width: "25%",
                                backgroundColor: "inherit",
                                border: "none",
                                fontSize: "larger"
                            }}
                            onClick={handleSearchClick}
                        >
                            <IoCallSharp />
                        </button>
                        <button
                            style={{
                                width: "25%",
                                backgroundColor: "inherit",
                                border: "none",
                                fontSize: "larger"
                            }}
                            onClick={handleSearchClick}
                        >
                            <FaSearch />
                        </button>
                        <button
                            style={{
                                width: "25%",
                                backgroundColor: "inherit",
                                border: "none",
                                fontSize: "larger"
                            }}
                            onClick={handleSearchClick}
                        >
                            <HiOutlineDotsVertical />
                        </button>
                    </div>
                </div>
                {/* Overlay */}
                {isOverlayVisible && (
                    <div
                        style={{
                            position: "fixed",
                            top: "68px",
                            right: "-100px",
                            width: "80%",
                            // height: "100%",
                            // backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "5px",
                                borderRadius: "8px",
                                width: "80%",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                            }}
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search messages"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                            <button
                                onClick={closeOverlay}
                                style={{
                                    marginTop: "10px",
                                    padding: "8px 16px",
                                    backgroundColor: "#007BFF",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div
                ref={chatRef}
                onScroll={handleScroll}
                style={{
                    maxHeight: '602px',
                    minHeight: '602px',
                    overflowY: 'auto',
                    backgroundColor: 'cornsilk', // Soft off-white background
                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                    padding: '15px', // Padding for content spacing
                    scrollbarWidth: 'none', // Hides scrollbar in Firefox
                    msOverflowStyle: 'none', // Hides scrollbar in IE/Edge
                    border: "none"
                }}
            >
                {renderMessages()}
                {isTyping && (
                    <svg
                        height="25"
                        width="50"
                        className="loader"
                        style={{
                            animation: 'fadeOut 2s forwards'
                        }}
                    >
                        <circle
                            className="dot"
                            cx="10"
                            cy="20"
                            r="3"
                            style={{
                                fill: 'grey',
                                animation: 'dotPulse 1.4s infinite ease-in-out'
                            }}
                        />
                        <circle
                            className="dot"
                            cx="20"
                            cy="20"
                            r="3"
                            style={{
                                fill: 'grey',
                                animation: 'dotPulse 1.4s infinite ease-in-out',
                                animationDelay: '0.2s'
                            }}
                        />
                        <circle
                            className="dot"
                            cx="30"
                            cy="20"
                            r="3"
                            style={{
                                fill: 'grey',
                                animation: 'dotPulse 1.4s infinite ease-in-out',
                                animationDelay: '0.4s'
                            }}
                        />
                    </svg>
                )}
            </div>

            <div className="input-container" style={{
            background: '#F0F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '63px',
            position: 'relative'
        }}>
            {/* Emoji Picker Button */}
            <button className="add" onClick={() => setShowPicker((val) => !val)} 
                style={{
                    marginRight: '10px',
                    border: 'none',
                    background: '#F0F2F5',
                    fontSize: '2em',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <MdEmojiEmotions />
            </button>

            {/* Emoji Picker Display */}
            {showPicker && (
                <div 
                    style={{
                        position: 'absolute',
                        bottom: "67px",
                        left: "3px",
                        zIndex: 1000
                    }}
                >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}

            {/* File Upload Overlay */}
            {showFileInput && (
                <div style={{
                    position: 'absolute',
                    bottom: "67px",  // Place above the input
                    left: '3px',
                    background: '#fff',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    zIndex: 1000,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{
                            fontSize: '1em',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            )}

            {/* File Upload Trigger */}
            <button onClick={() => setShowFileInput((val) => !val)} style={{
                marginRight: '10px',
                border: 'none',
                background: '#F0F2F5',
                fontSize: '2em',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: 'pointer'
            }}>
                <IoMdAttach />
            </button>

            {/* Message Input */}
            <input
                className="text-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        sendMessage();
                    }
                }}
                placeholder="Type a message"
                style={{
                    flexGrow: 1,
                    padding: '11px',
                    border: 'none',
                    borderRadius: '15px',
                }}
            />
            {/* Send Button */}
            <button className="send-button" onClick={sendMessage} 
                style={{
                    border: "none",
                    fontSize: "xx-large",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <IoMdSend />
            </button>
        </div>

        </div>
    );
};

export default ChatSection;


