import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';  // Import Socket.IO client
import "./Home.css";

export default function Home() {
    const navigate = useNavigate(); 

    // Socket.IO client connection
    useEffect(() => {
        // Retrieve the access token from localStorage
        const tokenB = localStorage.getItem('accessToken');
        if (!tokenB) {
            console.error('No access token found in localStorage');
            return;
        }

        const SERVER_URL = process.env.web_socket;  // Server URL
        const socketB = io(`${SERVER_URL}/im`, {
            query: { token: tokenB }
        });

        socketB.on('connect', () => {
            console.log(`Test connected.`);

            const participantIdA = '675027da20b5eb9a7cfe4a92';  // The participant ID of User A

            // Check if a conversation exists with participant A
            socketB.emit('checkConversation', { participantId: participantIdA });

            // Handle the response from the server regarding the conversation status
            socketB.on('conversationCheckResponse', (data) => {
                if (data.exists) {
                    console.log(`Conversation exists with ID: ${data.conversationId}`);
                    socketB.emit('joinRoom', data.conversationId);
                } else {
                    console.log('No existing conversation found. Creating a new conversation...');
                    socketB.emit('createConversation', { participantId: participantIdA });
                }
            });

            // Event listener for receiving messages
            socketB.on('receiveMessage', (msg) => {
                console.log(`\nUser B received: ${msg.message}`);
                socketB.emit('markAsSeen', { messageId: msg.messageId, conversationId: msg.conversationId });
            });
        });

        // Event listener for disconnection
        socketB.on('disconnect', (reason) => {
            console.log(`User B disconnected. Reason: ${reason}`);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socketB.disconnect();
        };
    }, []);  
    // Navigate to a different page when "Instant Messaging" is clicked
    const handleInstantMessagingClick = () => {
        navigate('/chat');  // Navigate to the home route
    };
    return (
        <div className="home-container">
            <div className="home-header">
                <div className='inner-header-div'>
                <div class="home-logo-div">
                <img className='home-logo' src="./images/beep.svg" alt="" />
                </div>
                <div className='user-logo-div'>
                 <img className="user-logo" src='https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=' alt='user-img'></img>
                <div className='user-name-div'>
                 <span className='user-name'>Guest</span>
                </div>
                </div>
                </div>
            </div>
            <div className="main-body">
                <div class="logger-noti-div">
                    <span class="logger-noti">Your are logged in</span>
                </div>
                <div className="home-body">
                    <button className="nav-buttons"  onClick={handleInstantMessagingClick}>
                        <div className="button-icon-div">
                            <img className="button-icon" src="/images/Im.jpg" alt="im" />
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title">Instant messaging</span>
                            </div>
                            <div className="text-description-div">
                                <span className="button-Description">Streamline communication with fast, real-time messaging. Share updates, files, and ideas instantly.</span>
                            </div>
                            <div className="bottom-button">
                                <button className="share">
                                   <img className='btm-btn-icon' src="/images/send.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </button>
                    <button className="nav-buttons" style={{gap:"20px"}}>
                        <div className="button-icon-div">
                            <img className="button-icon" src="/images/Vc.jpg" alt="VC" />
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title" style={{ paddingLeft: '7px' }}>Video Conferencing</span>
                            </div>
                            <div className="text-description-div">
                                <span className="button-Description">Connect with people around the world through live virtual events, from small meetings to large conferences.</span>
                            </div>
                            <div className="bottom-button">
                                <button className="share">
                                   <img className='btm-btn-icon' src="/images/send.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </button>

                </div>
            </div>
            <div className="home-footer">
                <div className='inner-div'>
                <div className="left-copyright">
                    © Copyright 2024 Beep, All Rights Reserved
                </div>
                <div class="footer-links">
                    <ul className='url-list'>
                        <li><a href="terms.html">Terms & Conditions</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    );
}
