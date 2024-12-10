import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import "./Home.css";

export default function Home() {
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // State to store API user info
    const {
        accessToken,
        fetchChatrooms,
        chatrooms,
        chatroomsError,
    } = useContext(AppContext);

    const navigate = useNavigate();

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_REST_URL}/im/user-data`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Fetched User Data:", response.data);
            setUserInfo(response.data.user); // Store user data in state
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.response?.data?.message || "Failed to fetch user data");
            setRawResponse(err.response?.data || "No response data");
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchUserData();
            fetchChatrooms();
        }
    }, [accessToken, fetchChatrooms]);

    const handleInstantMessagingClick = () => {
        navigate('/chat');
    };

    const handleonvcClick = () => {
        navigate('/vc');
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <div className='inner-header-div'>
                    <div className="home-logo-div">
                        <img className='home-logo' src="./images/beep.svg" alt="Logo" />
                    </div>
                    <div className='user-logo-div'>
                        <img
                            className="user-logo"
                            src={userInfo?.profilePic || 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0='}
                            alt="User Avatar"
                        />
                        <div className='user-name-div'>
                            <span className="user-name">{userInfo?.username || 'Guest'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-body">
                <div className="home-body">
                    <div className='user-name-typing'>
                        <span className="user-name">welcome To beep{userInfo?.username || 'Guest'}</span>
                    </div>
                    <button className="nav-buttons-im" onClick={handleInstantMessagingClick}>
                        <div className="button-icon-div">
                            {/* <img className="button-icon" src="/images/im.webp" alt="IM" /> */}
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title">Instant Messaging</span>
                            </div>
                            <div className="text-description-div">
                                <span className="button-description">
                                    Streamline communication with fast, real-time messaging. Share updates, files, and ideas instantly.
                                </span>
                            </div>
                            <div className="bottom-button">
                                <button className="share">
                                    <img className='btm-btn-icon' src="/images/send.svg" alt="Send" />
                                </button>
                            </div>
                        </div>
                    </button>
                    <button className="nav-buttons" onClick={handleonvcClick}>
                        <div className="button-icon-div">
                            {/* <img className="button-icon" src="/images/Vc.webp" alt="VC" /> */}
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title">Video Conferencing</span>
                            </div>
                            <div className="text-description-div">
                                <span className="button-description">
                                    Connect with people around the world through live virtual events, from small meetings to large conferences.
                                </span>
                            </div>
                            <div className="bottom-button">
                                <button className="share">
                                    <img className='btm-btn-icon' src="/images/send.svg" alt="Send" />
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
                    <div className="footer-links">
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
