import React, { useState, useEffect } from "react";
import "./room.css";
import SearchBar from "./SearchBar";
import RoomCard from "./RoomCard";

const VideoCall = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("Rooms");
  const [roomsData, setRoomsData] = useState([]);
  const [userData, setUserData] = useState({
    name: "Administrator",
    imageUrl: "../../../Images/user.png",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      console.log("Fetched Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return [];
    }
  };

  // Fetch rooms data on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await fetchData("/api/rooms");
      setRoomsData(data);
    };

    fetchRooms();
  }, []);

  // Function to handle tab changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ background: "#f5f5f5", height: "100vh", overflow: "hidden" }}>
      <header
        style={{
          background: "#ffffff",
          padding: "5px 20px",
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
            style={{ height: "50px" }}
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
                background: activeTab === "Rooms" ? "#ccc" : "#fff",
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
                background: activeTab === "Recording" ? "#ccc" : "#fff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Recording
            </button>
            {/* <button
              onClick={() => handleTabClick("Instant Messaging")}
              style={{
                padding: "8px 30px",
                background: activeTab === "Instant Messaging" ? "#ccc" : "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Instant Messaging
            </button> */}
            <button
              onClick={() => {
                window.location.href = "https://wa.beep.gov.pk/#/login";
              }}
              style={{
                padding: "8px 30px",
                background: activeTab === "Instant Messaging" ? "#ccc" : "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Instant Messaging
            </button>
          </div>

          {/* User Profile with Dropdown */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              position: "relative",
            }}
          >
            <h3>{userData.name}</h3>
            <img
              style={{ borderRadius: "50px" }}
              src={userData.imageUrl}
              alt="user"
            />
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
                  onClick={() => alert("Profile clicked")}
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
                  onClick={() => alert("Logout clicked")}
                >
                  Sign Out
                </button>
              </ul>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Search Bar */}
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />

        {/* Rooms Tab Content */}
        {activeTab === "Rooms" && (
          <div style={{ paddingLeft: "20px" }}>
            <RoomCard rooms={roomsData} />
          </div>
        )}

        {/* Recording Tab Content */}
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

        {/* Instant Messaging Tab Content */}
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
