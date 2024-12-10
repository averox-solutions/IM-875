import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from "axios";
import AppContext from '../AppContext';
import "./Home.css";

export default function Home() {
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState(null);
    const {
        user,
        accessToken,
        logoutUser,
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
                    <div class="home-logo-div">
                        <img className='home-logo' src="./images/beep.svg" alt="" />
                    </div>
                    <div className='user-logo-div'>
                        <img
                            className="user-logo"
                            src={user?.profilePicture || 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0='}
                            alt="User Avatar"
                        />
                        <div className='user-name-div'>
                            <span className="user-name">{user?.name || 'Guest'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-body">
                <div class="logger-noti-div">
                    <span class="logger-noti">Your are logged in</span>
                </div>
                <div className="home-body">
                    <button className="nav-buttons" onClick={handleInstantMessagingClick}>
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
                    <button className="nav-buttons" onClick={handleonvcClick} style={{ gap: "20px" }}>
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
