import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";

export default function SearchBar({ searchInput, setSearchInput, isLoading, setIsLoading, setRooms, rooms }) {
  const { t } = useTranslation();

  // State for modal visibility, room name, and fetched rooms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Handle changes in the search input
  const onChangeHandler = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter rooms based on search input
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRooms(filtered);
  };

  // Debounce the search input handler
  const debouncedOnChangeHandler = useMemo(
    () => debounce(onChangeHandler, 300),
    [rooms]
  );

  useEffect(() => {
    return () => {
      debouncedOnChangeHandler.cancel();
    };
  }, [debouncedOnChangeHandler]);

  // Handle the creation of a new room
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert(t("Room name cannot be empty"));
      return;
    }

    const newRoom = {
      name: roomName,
      created_at: new Date().toISOString(),
    };

    const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
      }

    try {
      const response = await fetch("http://localhost:8000/vc/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name:roomName
        }),
      });

      if (!response.ok) {
        throw new Error(t("Failed to create room"));
      }

      const createdRoom = await response.json();

      // Add the new room to the state
      setRooms(createdRoom.userRooms.reverse());
      setIsModalOpen(false);
      setRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
      alert(t("Failed to create room. Please try again."));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
          gap: "25px",
        }}
      >
        <div style={{ position: "relative", width: "70%" }}>
          <svg
            style={{
              position: "absolute",
              top: "10px",
              left: "15px",
              height: "24px",
              width: "24px",
              fill: "#4B882B",
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            style={{
              width: "100%",
              padding: "10px 40px 10px 50px",
              outline: "none",
              borderRadius: "10px",
              border: "none",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              fontSize: "16px",
              cursor: "text",
            }}
            placeholder={t("Search here...")}
            type="search"
            onChange={debouncedOnChangeHandler}
          />
        </div>
        <button
          style={{
            padding: "12px 30px",
            border: "none",
            borderRadius: "10px",
            background: "rgb(75, 136, 43)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            transition: "background-color 0.5s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgb(60, 120, 35)")}
          onMouseLeave={(e) => (e.target.style.background = "rgb(75, 136, 43)")}
          onClick={() => setIsModalOpen(true)}
        >
          {t("+   New Room")}
        </button>
      </div>

      {isLoading ? (
  <div>{t("Loading...")}</div>
) : (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
      marginTop: "20px",
      width: "100%",
      maxWidth: "900px",
    }}
  >
  </div>
)}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "8px",
              width: "30%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2>{t("Create a New Room")}</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={t("Enter a room name")}
              style={{
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "95%",
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "10px 50px",
                  background: "#fff",
                  color: "#000",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                {t("Close")}
              </button>
              <button
                onClick={handleCreateRoom}
                style={{
                  padding: "10px 20px",
                  background: "rgb(75, 136, 43)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {t("Create Room")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchInput: "",
};
