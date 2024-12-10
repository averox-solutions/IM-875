import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = (props) => {
  const { searchInput, setSearchInput, isLoading, setIsLoading, rooms, setRooms } = props
  const navigate = useNavigate();
  const API = "http://localhost:8000";

  // const fetchApiData = async (URL) => {
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");

  //     if (!accessToken) {
  //       console.error("Access token not found in localStorage");
  //       return;
  //     }

  //     const res = await fetch(`${URL}/vc/get-all-rooms`, {
  //       method: "GET",
  //       headers: {
  //         "ngrok-skip-browser-warning": "true",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     console.log("API Response:", data); // Debugging
  //     if (data.rooms) {
  //       setRooms(data.rooms);
  //     } else {
  //       console.warn("No 'rooms' key in API response");
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching API data:", error);
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchApiData(API);
  // }, [API]);

  return (
    <div
      style={{
        width: "98%",
        background: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {rooms.map((room) => {
            console.log("Room Object:", room); // Debugging
            return (
              <div
                key={room.id || room._id || room.room_id} // Adjust key if needed
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "15px",
                  padding: "15px",
                  background: "linear-gradient(to right, #ffffff, #f0f8ff)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src="../../../Images/iconRoom.png"
                    alt="Room Icon"
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      {room.name}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        textAlign: "center",
                      }}
                    >
                      {room.created_at}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <button
                    style={{
                      padding: "10px 50px",
                      border: "none",
                      background: "rgb(75, 136, 43)",
                      color: "#fff",
                      borderRadius: "10px",
                    }}
                    onClick={() =>
                      navigate(
                        `/vc/room?id=${room.connection_string}`
                      )
                    }
                  >
                    Join
                  </button>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="35px"
                      viewBox="0 -960 960 960"
                      width="35px"
                      fill="#4B882B"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomCard;
