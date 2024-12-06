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

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data); // Log API response to console
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return [];
    }
  };

  // Fetch rooms data on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await fetchData("/api/rooms"); // Replace with your API endpoint
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
                outline: "none",
                transition: "background-color 0.5s ease",

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
                outline: "none",
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
                outline: "none",
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
          <img
            style={{ borderRadius: "50px" }}
            src={userData.imageUrl}
            alt="user"
          />
          <div className="dropdown">
            {/* Dropdown menu can be activated here */}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />

      {/* Apply padding to RoomCard only */}
      {activeTab === "Rooms" && (
        <div style={{ paddingLeft: "20px" }}>
          <RoomCard rooms={roomsData} />
        </div>
      )}

      {/* Recording tab content */}
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

      {/* Instant Messaging tab content */}
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
    </div>
  );
};

export default VideoCall;
