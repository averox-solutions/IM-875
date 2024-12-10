import React, { useState } from "react";
import { Grid, AppBar, Tabs } from "@mui/material";
import { MicOff } from "@mui/icons-material";
import "./VideoCall.css";
import Image1 from "./images/Image1.png";
import Image2 from "./images/Image2.png";
import Image3 from "./images/Image3.png";
import Image4 from "./images/Image4.png";
import Image5 from "./images/Image5.png";
import Image6 from "./images/Image6.png";
import Image7 from "./images/Image7.png";
import Image8 from "./images/Image8.png";
import Image9 from "./images/Image9.png";
import Image10 from "./images/Image10.png";
import Image11 from "./images/Image11.png";
import Image12 from "./images/Image12.png";

const placeholderImages = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
  Image10,
  Image11,
  Image12,
];

const VideoCall = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleMic = () => {
    setMicMuted((prevState) => !prevState);
  };

  const toggleVideo = () => {
    setVideoOff((prevState) => !prevState);
  };

  return (
    <div
      className="video-call"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        paddingTop: "20px",
      }}
    >
      {/* Video Grid */}
      <Grid
        container
        spacing={2}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "45px",
        }}
      >
        {placeholderImages.map((src, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <div className="video-tile" style={{ position: "relative" }}>
              <img
                src={src}
                alt={`Participant ${index + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div className="mic">
                <MicOff style={{ color: "white", fontSize: "24px" }} />
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      <div style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
        <AppBar position="static" color="default">
          <Tabs value={activeTab} onChange={handleTabChange}>
            {/* <Tab label="Chat" value="chats" icon={<Chat />} /> */}
            {/* <Tab label="Participants" value="participants" icon={<People />} /> */}
          </Tabs>
        </AppBar>
      </div>

      {/* Footer Controls */}
      {/* <div
        className="controls"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <IconButton onClick={toggleMic} color={micMuted ? "secondary" : "default"}>
          {micMuted ? <MicOff /> : <Mic />}
        </IconButton>
        <IconButton
          onClick={toggleVideo}
          color={videoOff ? "secondary" : "default"}
        >
          {videoOff ? <VideocamOff /> : <Videocam />}
        </IconButton>
        <IconButton color="error">
          <CallEnd />
        </IconButton>
      </div> */}
    </div>
  );
};

export default VideoCall;