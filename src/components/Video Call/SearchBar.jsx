import React from "react";

const SearchBar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <input
        style={{
          boxShadow: "1px 2px 2px 2px #e5e5e5",
          border: "none",
          width: "25%",
          padding: "12px",
          borderRadius: "8px",
          outline: "none",
        }}
        type="text"
        name="search"
        placeholder="Search here ......"
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
        }}
      >
        New Room
      </button>
    </div>
  );
};

export default SearchBar;
