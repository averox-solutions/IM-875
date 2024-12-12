import React, { useEffect, useRef, useState } from "react";
import { MicOff, Mic, Videocam, VideocamOff } from "@mui/icons-material";
import "./style.css";
import useNavigation from "./navigate";
import Image1 from "./images/Image1.png";
import Image2 from "./images/Image2.png";
import Image3 from "./images/Image3.png";
import Image4 from "./images/Image4.png";
import Image5 from "./images/Image5.png";

const VideoConference = () => {
  const navigateTo = useNavigation();

  const [streams, setStreams] = useState([]);
  const [active, setActive] = useState("chat");
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const toggle = (option) => setActive(option);
  const toggleMic = () => setMicMuted(!micMuted);
  const toggleVideo = () => setVideoOff(!videoOff);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStreams((prev) => [...prev, stream]);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  const handleNavigation = () => navigateTo("/about");

  return (
    <div className="video-conference">
      <div className="container banner">
        <div className="video-calling">
          <div className="col top-img">
            <img src={Image4} alt="Top Banner" />
          </div>
          <div className="end-pic">
            <img src={Image5} alt="User 5" />
            <img src={Image3} alt="User 3" />
            <img src={Image2} alt="User 2" />
            <img src={Image1} alt="User 1" />
          </div>
        </div>

        <div className="chat-panel-funct">
          <div className="chat-panal">
            <div className="chat-buton">
              <button
                className={`toggle ${active === "chat" ? "active" : ""}`}
                onClick={() => toggle("chat")}
                type="button"
                role="tab"
                style={{
                  borderBottomLeftRadius: "20px",
                  borderTopLeftRadius: "20px",
                }}
              >
                Chat
              </button>
              <button
                className={`toggle ${active === "participants" ? "active" : ""
                  }`}
                onClick={() => toggle("participants")}
                type="button"
                role="tab"
                style={{
                  borderBottomRightRadius: "20px",
                  borderTopRightRadius: "20px",
                }}
              >
                Participants
              </button>
            </div>
            <div className="empty">
              <img src="./images/Chat-Empty.png" alt="Empty Chat" />
            </div>
            <div className="chat-body-main">
              <h5 className="conversion">Start a conversation</h5>
              <span className="chat-placeholdr">
                There are no messages here yet. Start a conversation by sending
                a message.
              </span>
            </div>
            <div className="chat-body-end">
              <span>To</span>
              <div className="chat-body-Htag">
                <button onClick={toggleVideo}>
                  {videoOff ? <VideocamOff /> : <Videocam />}
                </button>
                <span>Everyone</span>
                <button onClick={toggleMic}>
                  {micMuted ? <MicOff /> : <Mic />}
                </button>
              </div>
            </div>
            <div className="chat-footer">
              <input
                type="text"
                name="message"
                placeholder="Send a message..."
              />
              <img
                onClick={handleNavigation}
                className="chat-footer-search-text-send"
                src="../../Images/Send.png"
                alt="Send Message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;
