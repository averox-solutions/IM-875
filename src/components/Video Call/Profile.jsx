import React, { useState } from "react";

const Profile = () => {
  const [fullName, setFullName] = useState("haroonmazhar");
  const [email, setEmail] = useState("haroonmazhar748@gmail.com");
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState(null);
  const [userData, setUserData] = useState({
    name: "Administrator",
    imageUrl: "../../../Images/user.png",
  });

  const handleReset = () => {
    setFullName("haroonmazhar");
    setEmail("haroonmazhar748@gmail.com");
    setLanguage("English");
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    setAvatar(URL.createObjectURL(file));
  };

  const handleAvatarDelete = () => {
    setAvatar(null);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <img
          className="logo-img"
          src="../../../Images/Logo.png"
          alt="beeplogo"
          style={{ height: "50px", width: "100px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3 style={{ color: "grey", fontWeight: "none", fontSize: "16px" }}>
            {userData.name}
          </h3>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ borderRadius: "50px" }}
              src={userData.imageUrl}
              alt="user"
            />
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        style={{
          display: "flex",
          margin: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: "250px",
            backgroundColor: "#f1f4f9",
            padding: "20px",
          }}
        >
          <div
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Account Info
          </div>
          <div
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#495057",
            }}
          >
            Change Password
          </div>
          <div
            style={{
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#495057",
            }}
          >
            Delete Account
          </div>
        </div>
        <div
          style={{
            padding: "30px",
            backgroundColor: "#ffffff",
            display: "flex",
            gap:"800px"
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "#343a40" }}>
              Update Account Info
            </h2>
            <div style={{ marginBottom: "20px" , width:"300%"}}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#495057",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px", width:"300%" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#495057",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px", width:"310%" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#495057",
                }}
              >
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                gap: "15px",
              }}
            >
              <button
                onClick={handleReset}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  fontWeight: "bold",
                  color: "#343a40",
                }}
              >
                Reset
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#28a745",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Update
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%" }}></div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <label
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Upload Avatar
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                />
              </label>
              <button
                onClick={handleAvatarDelete}
                disabled={!avatar}
                style={{
                  padding: "10px 20px",
                  backgroundColor: avatar ? "#dc3545" : "#f8f9fa",
                  color: avatar ? "white" : "#ced4da",
                  border: "none",
                  borderRadius: "5px",
                  cursor: avatar ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                }}
              >
                Delete Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
