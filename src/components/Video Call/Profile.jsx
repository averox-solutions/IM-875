import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [fullName, setFullName] = useState("haroonmazhar");
  const [email, setEmail] = useState("haroonmazhar748@gmail.com");
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState(null);
  const [userData, setUserData] = useState({
    name: "Administrator",
    imageUrl: "../../../Images/user.png",
  });
  const [activeSection, setActiveSection] = useState("AccountInfo");

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  const handleReset = () => {
    setFullName("haroonmazhar");
    setEmail("haroonmazhar748@gmail.com");
    setLanguage("English");
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setAvatar(avatarUrl);
      localStorage.setItem("avatar", avatarUrl);
    }
  };

  const handleAvatarDelete = () => {
    setAvatar(null);
    localStorage.removeItem("avatar");
  };

  const renderChangePassword = () => (
    <div className="form-section-profile">
      <h2>Change Password</h2>
      <div className="form-group-profile">
        <label>Current Password</label>
        <input type="password" placeholder="Enter your password" />
      </div>
      <div className="form-group-profile">
        <label>New Password</label>
        <input type="password" placeholder="Enter your new password" />
      </div>
      <div className="form-group-profile">
        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm your new password" />
      </div>
      <div className="button-container-profile">
        <button className="button-cancel">Cancel</button>
        <button className="button update-profile">Change Password</button>
      </div>
    </div>
  );

  const renderDeleteAccount = () => (
    <div className="form-section-profile">
      <h2>Permanently Delete Your Account</h2>
      <p className="p-del">
        If you choose to delete your account, it will <strong>NOT</strong> be
        recoverable. All information regarding your account, including settings,
        rooms, and recordings will be removed.
      </p>
      <button className="button delete-account">
        Yes, I would like to delete my account
      </button>
    </div>
  );

  return (
    <div className="profile1-container">
      <header className="header-profile">
        <img
          className="logo-beep-img"
          src="../../../Images/Logo.png"
          alt="beeplogo"
        />
        <div className="user-info-1">
          <h3 className="user-name-1">{userData.name}</h3>
          <div className="avatar-container-1">
            <img
              className="avatar-user"
              src={avatar || userData.imageUrl}
              alt=""
            />
          </div>
        </div>
      </header>

      <div className="profile-content-profile">
        <div className="sidebar-profile">
          <div
            className={`sidebar-item-profile ${
              activeSection === "AccountInfo" ? "active" : ""
            }`}
            onClick={() => setActiveSection("AccountInfo")}
          >
            Account Info
          </div>
          <div
            className={`sidebar-item-profile ${
              activeSection === "ChangePassword" ? "active" : ""
            }`}
            onClick={() => setActiveSection("ChangePassword")}
          >
            Change Password
          </div>
          <div
            className={`sidebar-item-profile ${
              activeSection === "DeleteAccount" ? "active" : ""
            }`}
            onClick={() => setActiveSection("DeleteAccount")}
          >
            Delete Account
          </div>
        </div>

        <div className="main-content-profile">
          {activeSection === "AccountInfo" && (
 <div className="profile-container">
 {/* Left Side - Update Account Info */}
 <div className="form-section-profile">
   <h2>Update Account Info</h2>
   <div className="form-group-profile">
     <label>Full Name</label>
     <input
       type="text"
       value={fullName}
       onChange={(e) => setFullName(e.target.value)}
     />
   </div>
   <div className="form-group-profile">
     <label>Email</label>
     <input
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
     />
   </div>
   <div className="form-group-profile">
     <label>Language</label>
     <select value={language} onChange={(e) => setLanguage(e.target.value)}>
       <option value="English">English</option>
       <option value="Urdu">Urdu</option>
       <option value="Punjabi">Punjabi</option>
     </select>
   </div>

   <div className="button-container-profile">
     <button onClick={handleReset} className="button reset">
       Reset
     </button>
     <button className="button update-profile">Update</button>
   </div>
 </div>

 {/* Right Side - Avatar Upload/Delete */}
 <div className="avatar-section-profile">
   <div className="avatar-preview">
     {avatar ? (
       <img src={avatar} alt="" className="avatar-image" />
     ) : (
       <div className="avatar-placeholder"></div>
     )}
   </div>
   <div className="avatar-actions">
     <label className="upload-avatar-button">
       Upload Avatar
       <input
         type="file"
         className="hidden-input"
         onChange={handleAvatarUpload}
       />
     </label>
     <button
       onClick={handleAvatarDelete}
       disabled={!avatar}
       className={`delete-avatar-button ${avatar ? "active" : "disabled"}`}
     >
       Delete Avatar
     </button>
   </div>
 </div>
</div>

          )}
          {activeSection === "ChangePassword" && renderChangePassword()}
          {activeSection === "DeleteAccount" && renderDeleteAccount()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
