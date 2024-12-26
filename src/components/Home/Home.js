import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import "./Home.css";
// import VCImg from '../../assets/vc.webp'

export default function Home() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);  // Flag to track if the API is fetched
    const accessToken = localStorage.getItem('accessToken');

    const fetchUserData = async () => {
        try {
            if (hasFetched) return;  // Prevent multiple fetch calls

            const apiUrl = `${process.env.REACT_APP_REST_URL}/im/user-data`;
            const response = await fetch(apiUrl, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Clean the profilePic URL and extract data
            const cleanedData = {
                currentUserId: data.currentUserId,
                username: data.username,
                profilePic: cleanUrl(data.profilePic),  // Clean the profilePic URL
            };

            setUserInfo(cleanedData);
            localStorage.setItem('userInfo', JSON.stringify(cleanedData));  // Save to localStorage
            setHasFetched(true);  // Mark the fetch as complete

        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.message || 'Failed to fetch user data');
        }
    };

    const cleanUrl = (url) => {
        try {
            return url.replace(/https?:\/\/.*https?:\/\//, 'https://');
        } catch {
            console.error('Invalid URL format:', url);
            return 'https://via.placeholder.com/150';
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchUserData();
        }
    }, []);  // Adding 'hasFetched' ensures the API call is triggered only once


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
                        <img className="home-logo" src="" alt="Logo" />
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
                        <span className="user-name">Welcome to bingo,All in one Secure platefrom</span>
                    </div>
                    <button className="nav-buttons-im" onClick={handleInstantMessagingClick}>
                        <div className="button-icon-div">
                            {/* <img className="button-icon" src="/images/Im.jpg" alt="im" /> */}
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
                                    {/* <img className='btm-btn-icon' src="/images/send.svg" alt="" /> */}
                                </button>
                            </div>
                        </div>
                    </button>
                    <button className="nav-buttons" style={{ gap: "20px" }}>
                        <div className="button-icon-div">
                            <img className="button-icon" alt="VC" />
                        </div>
                        <div className="button-text-container">
                            <div className="title-div">
                                <span className="button-title" >Video Conferencing</span>
                            </div>
                            <div className="text-description-div">
                                <span className="button-Description">Connect with people around the world through live virtual events, from small meetings to large conferences.</span>
                            </div>
                            <div className="bottom-button">
                                <button className="share">
                                    {/* <img className='btm-btn-icon' src="/images/send.svg" alt="" /> */}
                                </button>
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

