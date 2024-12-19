import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Setting.css";
import { IoArrowBackOutline } from "react-icons/io5";

const Setting = () => {
  const [roomData, setRoomData] = useState({
    roomName: "Haroon Room",
    email: "          Haroon@gmail.com",
  });
  const [userSettings, setUserSettings] = useState({
    requiresSignIn: true,
    allowRecording: true,
    requireApproval: true,
    allUsersModerators: true,
    allowAnyUserToStart: false,
    muteOnJoin: false,
  });
  const navigate = useNavigate();
  const handleToggle = (settingKey) => {
    setUserSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const handleBackButtonClick = () => {
    navigate("/vc");
  };

  return (
    <header className="setting-container">
      <img
        className="setting-logo"
        src="../../Images/Logo.png"
        alt="Beep Logo"
      />
      <div className="setting-bar">
        {/* <svg
          className="back-svg"
          style={{
            padding: "40px",
            transition: "transform 0.3s ease, fill 0.3s ease",
          }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleBackButtonClick}
        >
          <path
            d="M1.81696 12.992L15.809 18.772C16.3384 18.9912 16.9195 19.0541 17.4835 18.9531C18.0475 18.8521 18.5708 18.5916 18.9914 18.2023C19.412 17.813 19.7123 17.3113 19.8568 16.7565C20.0013 16.2018 19.9839 15.6172 19.8067 15.072L18.2675 10.222L19.8466 5.37202C20.0287 4.82466 20.0491 4.23641 19.9055 3.67772C19.762 3.11904 19.4604 2.61362 19.0371 2.22202C18.4928 1.71695 17.7805 1.4319 17.0382 1.42202C16.6437 1.42228 16.2532 1.50044 15.8889 1.65202L1.84694 7.43202C1.30008 7.65958 0.832817 8.04411 0.504116 8.53708C0.175415 9.03006 0 9.6094 0 10.202C0 10.7946 0.175415 11.374 0.504116 11.867C0.832817 12.3599 1.30008 12.7445 1.84694 12.972L1.81696 12.992ZM16.6185 3.52202C16.7948 3.44925 16.9882 3.42848 17.1759 3.46214C17.3636 3.49581 17.5378 3.58251 17.6779 3.71202C17.8098 3.83817 17.9047 3.99805 17.9523 4.17434C17.9999 4.35062 17.9983 4.53657 17.9477 4.71202L16.4886 9.22202L2.76642 9.22202L16.6185 3.52202ZM16.4886 11.222L17.9777 15.692C18.0283 15.8675 18.0298 16.0534 17.9823 16.2297C17.9347 16.406 17.8398 16.5659 17.7079 16.692C17.6138 16.7907 17.5006 16.8692 17.3751 16.9225C17.2496 16.9758 17.1146 17.0029 16.9783 17.002C16.8443 17.0018 16.7118 16.9746 16.5885 16.922L2.76642 11.222H16.4886Z"
            fill="#ffffff"
          />
        </svg> */}

        <IoArrowBackOutline style={{
          // padding: "40px",
          // transition: "transform 0.3s ease, fill 0.3s ease",
        }} className="back-svg" onClick={handleBackButtonClick} />

        <h1 className="setting-title">Settings</h1>
      </div>

      <div className="body-part">
        <div className="body-heading-del-btn">
          <h2>{roomData.roomName}</h2>
          <button className="delete-button">DELETE</button>
        </div>

        <div className="setting-footer">
          <button className="cancel-button">Cancel</button>
          <button className="save-button">Save</button>
        </div>
      </div>

      <div className="setting-content">
        <div className="room-info-panel">
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              value={roomData.roomName}
              onChange={(e) =>
                setRoomData({ ...roomData, roomName: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div className="form-group-1">
            <label>Email</label>
            <input
              type="email"
              value={roomData.email}
              onChange={(e) =>
                setRoomData({ ...roomData, email: e.target.value })
              }
              className="input-field-mail"
            />
            <svg
              className="mail-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
            </svg>
          </div>

          <div className="form-group">
            <label>Share Access</label>
            <select className="input-field">
              <option>Select users</option>
              <option>xyz</option>
              <option>123</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Room Icon</label>
            <div className="upload-area">
              Click to upload or drag and drop<br></br>
              <span>SVG, PNG, JPG or GIF (max 800x400px)</span>
            </div>
          </div>
        </div>

        <div className="user-settings-panel">
          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.requiresSignIn ? "active" : ""
                }`}
              onClick={() => handleToggle("requiresSignIn")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-1">
              <label>Requires users to sign in before joining</label>
              <label style={{ fontSize: "12px" }}>
                Autopaycut occurs at the end of each month{" "}
              </label>
            </div>
          </div>

          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.allowRecording ? "active" : ""
                }`}
              onClick={() => handleToggle("allowRecording")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-2">
              <label>Allow room to be recorded</label>
              <label style={{ fontSize: "12px" }}>
                You will be notified when a payment has been made
              </label>
            </div>
          </div>

          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.requireApproval ? "active" : ""
                }`}
              onClick={() => handleToggle("requireApproval")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-3">
              <label>Require moderator approval before joining</label>
              <label style={{ fontSize: "12px" }}>
                You will be notified when a payment has been made
              </label>
            </div>
          </div>

          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.allUsersModerators ? "active" : ""
                }`}
              onClick={() => handleToggle("allUsersModerators")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-4">
              <label>All users join as moderators</label>
              <label style={{ fontSize: "12px" }}>
                You will be notified when a payment has been made
              </label>
            </div>
          </div>

          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.allowAnyUserToStart ? "active" : ""
                }`}
              onClick={() => handleToggle("allowAnyUserToStart")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-5">
              <label>Allow any user to start this meeting</label>
              <label style={{ fontSize: "12px" }}>
                You will be notified when a payment has been made
              </label>
            </div>
          </div>

          <div className="settings-toggle">
            <div
              className={`toggle-button ${userSettings.muteOnJoin ? "active" : ""
                }`}
              onClick={() => handleToggle("muteOnJoin")}
            >
              <div className="toggle-circle"></div>
            </div>
            <div className="labeltoggle-6">
              <label>Mute users when they join</label>
              <label style={{ fontSize: "12px" }}>
                You will be notified when a payment has been made
              </label>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Setting;
