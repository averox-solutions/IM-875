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
            // Construct the API URL
            const apiUrl = `${process.env.REACT_APP_REST_URL}/im/user-data`;

            // Perform the API request
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`, // Use Bearer token for authorization
                },
            });

            // Check if the response is not OK
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.statusText}`);
            }

            // Parse the response JSON
            const data = await response.json();
            setUserInfo(data)
            console.log("API Response Data:", data);

            // Validate and process user data
            if (data?.user) {
                const cleanedUser = {
                    ...data.user,
                    profilePic: cleanUrl(data.user.profilePic),
                };
                console.log(userInfo)
                console.log("Processed User Data:", cleanedUser);
                setUserInfo(cleanedUser);
            } else {
                console.warn("Unexpected API response structure:", data);
                setUserInfo(null);
            }
        } catch (error) {
            // Log error details and set error state
            console.error("Error fetching user data:", error);
            setError(error.message || "Failed to fetch user data");
            setRawResponse(error.message || "No response data available");
        }
    };



    // Helper function to clean malformed URLs
    const cleanUrl = (url) => {
        try {
            // Remove duplicate protocol if it exists
            return url.replace(/https?:\/\/.*https?:\/\//, 'https://');
        } catch {
            console.error("Invalid URL format:", url);
            return 'https://via.placeholder.com/150'; // Default placeholder image
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
                <div className="inner-header-div">
                    <div className="home-logo-div">
                        <img className="home-logo" src="./images/beep.svg" alt="Logo" />
                    </div>
                    <div className="user-logo-div">
                        <img
                            className="user-logo"
                            src={

                                userInfo?.profilePic ||
                                'https://via.placeholder.com/150'
                            }
                            alt="User Avatar"
                        />
                        <div className="user-name-div">
                            <span className="user-name">
                                {console.log("Rendered Username:", userInfo?.username || "Guest")}
                                {userInfo?.username || 'Guest'}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div className="main-body">
                <div className="home-body">
                    <div className="user-name-typing">
                        <span className="user-name">Welcome to Beep, {userInfo?.username || 'Guest'}</span>
                    </div>
                    <button className="nav-buttons-im" onClick={handleInstantMessagingClick}>
                        <div className="button-icon-div">
                            <img className="button-icon" src="/images/im (2).webp" alt="IM" />
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title">Instant Messaging</span>
                                <img style={{ width: "10%" }} src="/images/arrow.svg" alt="arrow" />
                            </div>
                        </div>
                    </button>
                    <button className="nav-buttons" onClick={handleonvcClick}>
                        <div className="button-icon-div">
                            <img className="button-icon" src="/images/Vc.webp" alt="VC" />
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title">Video Conferencing</span>
                                <img style={{ width: "10%" }} src="/images/arrow.svg" alt="arrow" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="home-footer">
                <div className="inner-div">
                    <div className="left-copyright">
                        © Copyright 2024 Beep, All Rights Reserved
                    </div>
                    <div className="footer-links">
                        <ul className="url-list">
                            <li><a href="terms.html">Terms & Conditions</a></li>
                            <li><a href="privacy.html">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

