import React, { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import "primeicons/primeicons.css";
import { FaSearch, FaVideo, FaPhone, FaEllipsisV, FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import "./Chatsection.css";

const Chatsection =({ isZoneActive }) => {
  const initialMessages = [
    { id: 1, text: "Hello!", sender: "receiver", time: "08:30 AM" },
    { id: 2, text: "Hi! How are you?", sender: "sender", time: "08:31 AM" },
    // ... rest of the initial messages
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(isZoneActive === 'true'); // State to determine if it's a group chat
  const [isRecording, setIsRecording] = useState(false); // State for recording
  const [audioUrl, setAudioUrl] = useState(""); // To store the audio file URL
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsGroupChat(isZoneActive === 'true'); // Update state when prop changes
  }, [isZoneActive]);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: inputValue,
          sender: "sender",
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setInputValue("");
    }
  };

  const handleCameraClick = async () => {
    setShowCamera(true);
  };

  const onEmojiClick = (event, emojiObject) => {
    setInputValue((prevInputValue) => prevInputValue + emojiObject.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing the camera: ", err);
        }
      } else {
        alert("getUserMedia not supported on your browser!");
      }
    };

    if (showCamera) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    };
  }, [showCamera]);

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const isFirstMessage = (index) => {
    if (index === 0) return true;
    return messages[index].sender !== messages[index - 1].sender;
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      alert("Audio recording not supported on your browser!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="Container-right">
      <div className="navbar-right">
        <div className="logo">
          <img
            className="logo-img-chat"
            src="https://img.freepik.com/free-photo/businesswoman-with-arms-crossed_1157-18065.jpg?w=740"
            alt="logo"
          />
          <div className="name-container">
            <span className="name-right">Test user</span>
            <span
              className="Users-name"
              style={{ display: isGroupChat ? "block" : "none" }}
            >
              aamir, fadi, ali and you
            </span>
          </div>
        </div>
        <div className="icon-container">
          <div className="icons">
            <FaPhone
              style={{ transform: "rotate(90deg)" }}
              className="icon-size"
            />
          </div>
          <div className="icons">
            <FaVideo className="icon-size" />
          </div>
          <div className="icons">
            <FaSearch className="icon-size" />
          </div>
          <div className="icons">
            <FaEllipsisV className="icon-size" />
          </div>
        </div>
      </div>
      {isGroupChat ? (
        <div className="Groupsection">
          <div className="crpto-container">
            <span className="encrypt-text">
              🔒 Messages and calls are end-to-end encrypted. No one out of this
              chat, not even Beep, can read or listen to them. Tap to{" "}
              <a href="">learn more.</a>
            </span>
          </div>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message-wrapper-${
                message.sender === "sender" ? "s" : "r"
              }`}
            >
              {isFirstMessage(index) && message.sender === "receiver" && (
                <div className="profile-pic-div">
                  <img
                    className="group-profile-pic"
                    src={`https://img.freepik.com/free-photo/businesswoman-with-arms-crossed_1157-18065.jpg?w=740`}
                    alt={`${message.sender} profile`}
                  />
                </div>
              )}
              <div
                className={`message ${message.sender} ${
                  isFirstMessage(index) ? "first" : ""
                }`}
              >
                <div className="message-content">
                  {message.text}
                  <div className="time-right">
                    <div className="time-container">{message.time}</div>
                    {message.sender === "sender" && (
                      <div className="status">
                        <span className={`status-${message.status}`}>
                          {message.status === "read" ? "✔✔" : "✔"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="chatsection">
          <div className="crpto-container">
            <span className="encrypt-text">
              🔒 Messages and calls are end-to-end encrypted. No one out of this
              chat, not even Beep, can read or listen to them. Tap to{" "}
              <a href="">learn more.</a>
            </span>
          </div>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message ${message.sender} ${
                isFirstMessage(index) ? "first" : ""
              }`}
            >
              {message.text}
              <div className="time-right">
                <div className="time-container">{message.time}</div>
                {message.sender === "sender" && (
                  <div className="status">
                    <span className={`status-${message.status}`}>
                      {message.status === "read" ? "✔✔" : "✔"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display voice recording and other elements above the input container */}
      {isRecording && (
        <div className="recording-overlay">
          <div className="recording-container">
            <span className="recording-text">Recording...</span>
            <button className="stop-recording-button" onClick={stopRecording}>
              Stop
            </button>
          </div>
        </div>
      )}

      {audioUrl && (
        <CustomAudioPlayer src={audioUrl} />
      )}

      <div className="input-container">
        <button className="add" onClick={() => setShowPicker((val) => !val)}>
          {/* Emoji Button SVG */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7782 3.22184C16.7006 1.14421 13.9382 0 11 0C8.0618 0 5.29942 1.14421 3.22184 3.22184C1.14417 5.29942 0 8.0618 0 11C0 13.9382 1.14417 16.7006 3.22184 18.7782C5.29942 20.8558 8.0618 22 11 22C13.9382 22 16.7006 20.8558 18.7782 18.7782C20.8558 16.7006 22 13.9382 22 11C22 8.0618 20.8558 5.29942 18.7782 3.22184ZM11 20.6905C5.65666 20.6905 1.30952 16.3433 1.30952 11C1.30952 5.65666 5.65666 1.30952 11 1.30952C16.3433 1.30952 20.6905 5.65666 20.6905 11C20.6905 16.3433 16.3433 20.6905 11 20.6905Z"
              fill="black"
            />
            <path
              d="M8.62039 8.0952C7.54819 7.02291 5.80353 7.023 4.73133 8.0952C4.47562 8.35086 4.47562 8.76547 4.73133 9.02117C4.98708 9.27684 5.40169 9.27684 5.65735 9.02117C6.21904 8.45953 7.1329 8.45957 7.6945 9.02117C7.82237 9.14905 7.98991 9.21299 8.15744 9.21299C8.32498 9.21299 8.4926 9.14905 8.62039 9.02117C8.8761 8.76547 8.8761 8.3509 8.62039 8.0952ZM17.2684 8.0952C16.1962 7.023 14.4515 7.02291 13.3793 8.0952C13.1236 8.35086 13.1236 8.76547 13.3793 9.02117C13.6351 9.27684 14.0497 9.27684 14.3053 9.02117C14.8669 8.45953 15.7808 8.45949 16.3425 9.02117C16.4704 9.14905 16.6379 9.21299 16.8054 9.21299C16.973 9.21299 17.1406 9.14905 17.2684 9.02117C17.5241 8.76547 17.5241 8.3509 17.2684 8.0952ZM16.8055 11.4802H5.19436C4.83274 11.4802 4.5396 11.7734 4.5396 12.135C4.5396 15.6972 7.43772 18.5953 10.9999 18.5953C14.5621 18.5953 17.4602 15.6972 17.4602 12.135C17.4602 11.7734 17.1671 11.4802 16.8055 11.4802ZM10.9999 17.2858C8.38148 17.2858 6.21311 15.322 5.89054 12.7897H16.1093C15.7867 15.322 13.6183 17.2858 10.9999 17.2858Z"
              fill="black"
            />
          </svg>
        </button>

        <button className="add">
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.2188 9.71875H10.7812V1.28125C10.7812 0.849766 10.4315 0.5 10 0.5C9.56852 0.5 9.21875 0.849766 9.21875 1.28125V9.71875H0.78125C0.349766 9.71875 0 10.0685 0 10.5C0 10.9315 0.349766 11.2812 0.78125 11.2812H9.21875V19.7188C9.21875 20.1502 9.56852 20.5 10 20.5C10.4315 20.5 10.7812 20.1502 10.7812 19.7188V11.2812H19.2188C19.6502 11.2812 20 10.9315 20 10.5C20 10.0685 19.6502 9.71875 19.2188 9.71875Z"
              fill="#144322"
            />
          </svg>
        </button>

        <div className="inputs-feild">
          <div className="inputs-div">
            <input
              className="text-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message"
            />
          </div>
        </div>
        {inputValue ? (
          <button className="send-button" onClick={handleSendMessage}>
            <i
              className="pi pi-send"
              style={{
                fontSize: "1.5em",
                color: "black",
                position: "relative",
                top: "2px",
                right: "2px",
              }}
            ></i>
          </button>
        ) : (
          <button
            className="mic"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
          >
            <svg
              style={{ color: "black" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mic"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
        )}
      </div>

      {showPicker && (
        <div className="emoji-picker-overlay">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {showCamera && (
        <div className="camera-overlay">
          <div className="top-overlay">
            <span className="text-overlay">Take a shot</span>
            <button className="close-camera" onClick={handleCloseCamera}>
              X
            </button>
          </div>
          <div className="camera-container">
            <video ref={videoRef} className="camera-feed" autoPlay></video>
            <div className="bottom-container">
              <button className="switch-camera">3 dots</button>
              <button className="capture-button">Capture</button>
              <button className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (event) => {
    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="custom-audio-player">
      <button className="play-pause" onClick={handlePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100}
        onChange={handleSeek}
        className="progress-bar"
      />
      <span className="time">{formatTime(currentTime)}</span>
      <span className="time">/ {formatTime(duration)}</span>
      <FaVolumeUp className="volume-icon" />
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default Chatsection;
