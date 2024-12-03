import React, { useState, useEffect } from "react";
import "./room.css";
import SearchBar from "./SearchBar";
import RoomCard from "./RoomCard";

const VideoCall = () => {
  // State for managing button clicks
  const [activeTab, setActiveTab] = useState("Rooms");
  const [roomsData, setRoomsData] = useState([]);
  const [userData, setUserData] = useState({
    name: "Administrator",
    imageUrl: "../../../Images/user.png",
  });

  // Fetch dynamic data (for example, rooms data)
  useEffect(() => {
    // You can replace this with an actual API call to fetch room data
    const fetchRooms = async () => {
      const response = await fetch("/api/rooms"); // Example endpoint
      const data = await response.json();
      setRoomsData(data);
    };
    
    fetchRooms();
  }, []);

  // Function to handle tab changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ background: "#f5f5f5", height: "100vh" }}>
      <div className="container">
        <img
          className="logo-img"
          src="../../../Images/Logo.png"
          alt="beeplogo"
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
          <div>
            <button
              onClick={() => handleTabClick("Rooms")}
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background: activeTab === "Rooms" ? "#ccc" : "#fff",
                cursor: "pointer",
              }}
            >
              Rooms
            </button>
          </div>
          <div>
            <button
              onClick={() => handleTabClick("Recording")}
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background: activeTab === "Recording" ? "#ccc" : "#fff",
                cursor: "pointer",
              }}
            >
              Recording
            </button>
          </div>
          <div>
            <button
              onClick={() => handleTabClick("Instant Messaging")}
              style={{
                padding: "8px 30px",
                background: activeTab === "Instant Messaging" ? "#ccc" : "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Instant Messaging
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h3>{userData.name}</h3>
          <img src={userData.imageUrl} alt="user" />
          <div className="dropdown">
            {/* Dropdown menu can be activated here */}
          </div>
        </div>
      </div>

      <SearchBar />

      {/* Conditional rendering of RoomCard component based on active tab */}
      {activeTab === "Rooms" && <RoomCard rooms={roomsData} />}
      {activeTab === "Recording" && <div>Recording functionality here</div>}
      {activeTab === "Instant Messaging" && <div>Instant Messaging functionality here</div>}
    </div>
  );
};

export default VideoCall;
