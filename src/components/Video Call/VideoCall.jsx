import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./room.css";
import SearchBar from "./SearchBar";
import RoomCard from "./RoomCard";

const VideoCall = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("Rooms");
  const [rooms, setRooms] = useState([]);
  const [userData, setUserData] = useState({
    name: "Administrator",
    imageUrl: "../../../Images/user.png",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      // console.log("Fetched Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return [];
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSignOut = () => {
    setSignOutMessage("You have been signed out.");
    navigate("/login");
  };

  const fetchApiData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_REST_URL}/vc/get-all-rooms`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // console.log("API Response:", data); // Debugging
      if (data.rooms) {
        setIsLoading(false)
        setRooms(data.rooms);
      } else {
        console.warn("No 'rooms' key in API response");
      }
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching API data:", error);
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <div style={{ background: "#f5f5f5", height: "100vh", overflow: "hidden" }}>
      <header
        style={{
          background: "#ffffff",
          padding: "10px 20px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="container">
          <img
            className="logo-img"
            src="../../../Images/Logo.png"
            alt="beeplogo"
            style={{ height: "50px", width: "100px" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              background: "rgb(242 240 240)",
              padding: "3px",
              borderRadius: "15px",
              cursor: "pointer",
            }}
          >
            <button
              onClick={() => handleTabClick("Rooms")}
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background: activeTab === "Rooms" ? "rgb(75, 136, 43)" : "#fff",
                color: activeTab === "Rooms" ? "#fff" : "#000",
                cursor: "pointer",
                outline: "none",
                transition: "background-color 0.5s ease",
              }}
            >
              Rooms
            </button>
            <button
              onClick={() => handleTabClick("Recording")}
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background:
                  activeTab === "Recording" ? "rgb(75, 136, 43)" : "#fff",
                color: activeTab === "Rooms" ? "#000" : "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Recording
            </button>
            <button
              onClick={() => {
                window.location.href = "/chat";
              }}
              style={{
                padding: "8px 30px",
                background:
                  activeTab === "Instant Messaging"
                    ? "rgb(75, 136, 43)"
                    : "#fff",
                color: activeTab === "Rooms" ? "#000" : "#000",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Instant Messaging
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              position: "relative",
            }}
          >
            <h3 style={{ color: "grey", fontWeight: "none", fontSize: "16px" }}>
              {userData.name}
            </h3>

            <div
              style={{
                display: "flex",
                position: "relative",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
              onClick={toggleDropdown}
            >
              <span
                style={{
                  display: "block",
                  marginTop: "5px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                ▼
              </span>
            </div>
            {isDropdownOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  listStyle: "none",
                  padding: "10px",
                  margin: "10px 0 0 0",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <li
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() => navigate("/Profile")}
                >
                  Profile
                </li>
                <li
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                  }}
                  onClick={() => alert("Settings clicked")}
                >
                  Administrator
                </li>
                <button
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#fff",
                    background: "rgb(75, 136, 43)",
                    borderRadius: "5px",
                    border: "none",
                  }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </ul>
            )}
            <img
              style={{ borderRadius: "50px" }}
              src={userData.imageUrl}
              alt="user"
            />
          </div>
        </div>
      </header>

      <main>
        {signOutMessage && (
          <div
            style={{
              padding: "10px",
              background: "#dff0d8",
              color: "#3c763d",
              margin: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {signOutMessage}
          </div>
        )}

        <SearchBar isLoading={isLoading} setIsLoading={setIsLoading} setRooms={setRooms} rooms={rooms} searchInput={searchInput} setSearchInput={setSearchInput} />

        {activeTab === "Rooms" && (
          <div style={{ paddingLeft: "20px" }}>
            <RoomCard setRooms={setRooms} rooms={rooms} isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
        )}

        {activeTab === "Recording" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ddd",
              height: "10vh",
              textAlign: "center",
            }}
          >
            Recording functionality here
          </div>
        )}

        {activeTab === "Instant Messaging" && (
          <button
            style={{
              border: "none",
              background: "rgb(75, 136, 43)",
              padding: "10px 40px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
            }}
          >
            Instant Messaging
          </button>
        )}
      </main>
    </div>
  );
};

export default VideoCall;
