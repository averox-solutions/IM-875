import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";

const SearchBar = ({ searchInput, setSearchInput }) => {
  const { t } = useTranslation();

  // State for modal visibility and room name
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const onChangeHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const debouncedOnChangeHandler = useMemo(
    () => debounce(onChangeHandler, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedOnChangeHandler.cancel();
    };
  }, [debouncedOnChangeHandler]);

  // Handle opening the modal
  const handleNewRoomClick = () => {
    setIsModalOpen(true);
  };

  // Handle creating a room
  const handleCreateRoom = () => {
    // Here, you can implement the room creation logic (e.g., call an API)
    console.log("Room Created: ", roomName);
    setIsModalOpen(false);
    setRoomName("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: "100px",
          left: "25px",
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
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          border: "none",
          width: "25%",
          padding: "12px",
          borderRadius: "8px",
          outline: "none",
          paddingLeft: "50px",
        }}
        type="text"
        name="search"
        placeholder={t("Search here ......")}
        onChange={debouncedOnChangeHandler}
        onFocus={(e) => (e.target.style.borderColor = "#4B882B")}
        onBlur={(e) => (e.target.style.borderColor = "#4B882B")}
      />
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
        onClick={handleNewRoomClick}
      >
        {t("New Room")}
      </button>

      {/* Modal */}
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
};

SearchBar.propTypes = {
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchInput: "",
};

export default SearchBar;
