import React from "react";
import "./room.css";
import SearchBar from "./SearchBar";
import RoomCard from "./RoomCard";

const RoomNavbar = () => {
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
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Rooms
            </button>
          </div>
          <div>
            <button
              style={{
                padding: "8px 30px",
                border: "none",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Recording
            </button>
          </div>
          <div>
            <button
              style={{
                padding: "8px 30px",
                background: "#fff",
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
            justifyContent: "center", // Fixed typo here
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h3>Administrator</h3>
          <img src="../../../Images/user.png" alt="user" />
          {/* You can implement the dropdown logic here if needed */}
          <div className="dropdown">
            {/* Dropdown button and menu can be activated/removed as per your requirement */}
          </div>
        </div>
      </div>
      <SearchBar />
      <RoomCard />
    </div>
  );
};

export default RoomNavbar;
