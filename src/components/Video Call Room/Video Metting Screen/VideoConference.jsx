import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import VideoCall from "./VideoCall";
import useNavigation from "./navigate";
import { IoIosCopy, IoMdSend } from "react-icons/io";
import BeepLogo from '../../../assets/Beep.svg'
import ChatCloud from '../../../assets/chat-cloud.svg'
import { BsThreeDots } from "react-icons/bs";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { ImPhoneHangUp } from "react-icons/im";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { PiRecordLight, PiRecordFill } from "react-icons/pi";
import { IoHandRightOutline, IoHandRightSharp, IoSettingsSharp } from "react-icons/io5";
import { BiSolidBellRing } from "react-icons/bi";


const VideoConference = (props) => {
  const {
    room_id,
    username,
    localVideoRef,
    isVideoMuted,
    isAudioMuted,
    sendMessage,
    toggleVideoMute,
    toggleAudioMute,
    toggleScreenRecording,
    setScreenShare,
    screenShare,
    peers,
    handleLeaveRoom,
    messageList,
    setMessageList,
    userMessage,
    setUserMessage,
    screenRecording,
    setScreenRecording,
    handRaise,
    setHandRaise,
    toggleHandRaise,
    inMeetingNotification,
    setInMeetingNotification,
    handRaiseList,
    setHandRaiseList,
    handleHandRaise,
  } = props

  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [firstSearchItem, setFirstSearchItem] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activePopupIndex, setActivePopupIndex] = useState(null);
  const [chatView, setChatView] = useState('chat')

  const toggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  const handleInputChange = (e) => {
    setFirstSearchItem(e.target.value);
  };
  const [activeList, setActiveList] = useState(null);

  const toggleList = (listName) => {
    setActiveList(activeList === listName ? null : listName);
  };

  const [activeView, setActiveView] = useState("video");

  const toggleView = (view) => {
    setActiveView(view);
  };
  const navigateTo = useNavigation();
  const handleNavigation = () => {
    navigateTo("/about");
  };
  const placeholderImages = [
    "../images/Image1.png",
    "../images/Image2.png",
    "../images/Image3.png",
    "../images/Image4.png",
    "../images/Image5.png",
    "../images/Image6.png",
    "../images/Image7.png",
    "../images/Image8.png",
    "../images/Image9.png",
    "../images/Image10.png",
    "../images/Image11.png",
    "../images/Image12.png",
  ];

  const [streams, setStreams] = useState([]);
  const videoRefs = useRef([]);
  const [active, setActive] = useState("chats");
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const participants = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Antonio" },
    { id: 5, name: "Brayden" },
    { id: 6, name: "Devin" },
    { id: 7, name: "Marco" },
  ];

  const toggle = (option) => {
    setActive(option);
  };

  const toggleMic = () => {
    setMicMuted(!micMuted);
  };

  const toggleVideo = () => {
    setVideoOff(!videoOff);
  };

  const toggleScreenShare = () => {
    setScreenShare(!screenShare);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <div id='vc_header_master'>
        <img src={BeepLogo} alt="Beep Logo" className="vc_head_logo" />

        <div id='vc_head_copy_master' onClick={() => {
          const currentUrl = window.location.href; // Get the current browser URL
          navigator.clipboard
            .writeText(currentUrl) // Copy the URL to the clipboard
            .then(() => {
              alert("Copied!"); // Alert the user
            })
            .catch((err) => {
              console.error("Failed to copy: ", err);
            });
        }}>
          <IoIosCopy id='vc_head_copy_icon' />
        </div>



        {handRaiseList?.length > 0 &&
          <div className="vc_participants_moda_master">
            {inMeetingNotification.trim() !== '' && <div className="vc_participants_modal">
              <BiSolidBellRing className="vc_participants_moda_icon" />
              <span className="vc_participants_moda_span">{inMeetingNotification}</span>
            </div>
            }
            {handRaiseList.map((data, index) => {
              return (
                <div key={index} className="vc_participants_modal">
                  <IoHandRightSharp className="vc_participants_moda_hand" />
                  <span className="vc_participants_moda_span">{data.username} has raised their hand</span>
                </div>
              )
            })}
          </div>
        }

        {/* <div className="use-avater">
          {isSearchListVisible && (
            <input
              style={{
                border: "none",
                outline: "none",
                position: "absolute",
                right: "330px",
                width: "20%",
                height: "5vh",
                background: "#fbfbfb",
                paddingLeft: "23px",
                borderRadius: "10px",
                border: "1px solid #eeecec",
              }}
              type="text"
              placeholder="Enter Search"
              value={firstSearchItem}
              onChange={handleInputChange}
            />
          )}
          <button
            style={{ background: "none", border: "none", outline: "none" }}
            onClick={toggleSearchList}
          >
            <img
              src="../../Images/searchIcon.png"
              alt="Search Icon"
              onChange={handleInputChange}
            />
          </button>
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => toggleList("dropdown")}
          >
            <img src="../../Images/bell-icon-nav.png" alt="Bell Icon" />
          </button>
          <div onClick={() => {
            const currentUrl = window.location.href; // Get the current browser URL
            navigator.clipboard
              .writeText(currentUrl) // Copy the URL to the clipboard
              .then(() => {
                alert("Copied!"); // Alert the user
              })
              .catch((err) => {
                console.error("Failed to copy: ", err);
              });
          }}>
            <IoIosCopy style={{ fontSize: "24px", minWidth: "24px" }} />
          </div>
          <img
            src="../../Images/Image4.png"
            alt="User Avatar"
            style={{ width: "55px", height: "55px", borderRadius: "50px" }}
          />
          <span className="user-name">Jane Smith</span>
        </div> */}
        {/* 
        {activeList === "dropdown" && (
          <div className="dropdown">
            <div className="modal-body">
              <h5>Notifications</h5>
              <p>This triggers a popover on click.</p>
              <p>Have tooltips on hover.</p>
            </div>
          </div>
        )} */}
      </div>

      <div className="vc_participant_controls">
        <div className="vc_participant_control_child">
          <button
            // style={screenRecording ? { background: "rgb(230,230,230)" } : {}}
            onClick={toggleScreenRecording}
            className="vc_participant_control_btns"
          >
            {/* PiRecordLight, PiRecordFill */}
            {screenRecording ?
              <PiRecordFill style={screenRecording ? { color: "rgb(230, 0, 0)" } : {}} className="vc_participant_control_btn_icon" />
              :
              <PiRecordFill className="vc_participant_control_btn_icon" />
            }
          </button>

          <button
            onClick={toggleVideoMute}
            className="vc_participant_control_btns"
          >
            {isVideoMuted ?
              <HiVideoCameraSlash className="vc_participant_control_btn_icon" />
              :
              <HiVideoCamera className="vc_participant_control_btn_icon" />
            }
          </button>
          <button
            onClick={toggleAudioMute}
            className="vc_participant_control_btns"
          >
            {isAudioMuted ?
              <IoMdMicOff className="vc_participant_control_btn_icon" />
              :
              <IoMdMic className="vc_participant_control_btn_icon" />
            }
          </button>

          <button
            style={screenShare ? { background: "rgb(230,230,230)" } : {}}
            onClick={toggleScreenShare}
            className="vc_participant_control_btns"
          >
            {screenShare ?
              <LuScreenShareOff style={screenShare ? { color: "rgb(40,40,40)" } : {}} className="vc_participant_control_btn_icon" />
              :
              <LuScreenShare className="vc_participant_control_btn_icon" />
            }
          </button>

          <button
            style={handRaise ? { background: "rgb(230,230,230)" } : {}}
            onClick={toggleHandRaise}
            className="vc_participant_control_btns"
          >
            {handRaise ?
              <IoHandRightSharp style={handRaise ? { color: "rgb(40,40,40)" } : {}} className="vc_participant_control_btn_icon" />
              :
              <IoHandRightOutline className="vc_participant_control_btn_icon" />
            }
          </button>

          <button
            className="vc_participant_control_btns"
          >
            <BsThreeDots className="vc_participant_control_btn_icon" />
          </button>

          <button style={{ background: "rgb(230,0,0)" }} className="vc_participant_control_btns" onClick={handleLeaveRoom}>
            <ImPhoneHangUp style={{ color: "white" }} className="vc_participant_control_btn_icon" />
          </button>
        </div>
      </div>

      <VideoCall
        room_id={room_id}
        username={username}
        localVideoRef={localVideoRef}
        isVideoMuted={isVideoMuted}
        isAudioMuted={isAudioMuted}
        sendMessage={sendMessage}
        toggleVideoMute={toggleVideoMute}
        toggleAudioMute={toggleAudioMute}
        peers={peers}
        handleLeaveRoom={handleLeaveRoom}
      />


      <div className="chat_and_participants_master">
        <div className="chat_and_participants_btn_master">
          <div className="chat_and_participants_btn_child">
            <div onClick={() => {
              setChatView('chat')
            }} style={{
              borderTopLeftRadius: "100px",
              borderBottomLeftRadius: "100px",
              background: chatView == 'chat' ? 'white' : ''
            }} className="chat_and_participants_btn_chil_item">
              Chat
            </div>
            <div onClick={() => {
              setChatView('participants')
            }} style={{
              borderTopRightRadius: "100px",
              borderBottomRightRadius: "100px",
              background: chatView == 'participants' ? 'white' : ''
            }} className="chat_and_participants_btn_chil_item">
              Participants
            </div>
            {/* <button
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
            </button> */}
          </div>
        </div>
        {chatView === "chat" ? (
          <>
            {/* <div className="empt">
              <img src="../../Images/Chat-Empty.png" alt="Chat is empty" />
            </div>

            <h5 className="conversion">Start a conversation</h5>
            <span className="chat-placeholder">
              There are no messages here yet. Start a conversation by
              sending a message.
            </span>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  {message}
                </div>
              ))}
            </div> */}
            {messageList.length === 0 ?
              <div className="chat_and_participants_body_master">
                <img src={ChatCloud} alt="Chat is empty" />
                <h5 className="chat_and_participants_body_title">Start a conversation</h5>
                <span className="chat_and_participants_body_body">
                  There are no messages here yet. Start a conversation by
                  sending a message.
                </span>
              </div>
              :
              <div className="chat_and_participants_body_msg_master">
                <div className="chat_and_participants_body_msg_wrapper" id='chat_and_participants_body_msg_wrapper'>
                  {messageList.map((data, index) => {
                    return (
                      <div key={index} className="chat_and_participants_body_msg_child">
                        <div className="chat_and_participants_body_msg_chil_head">
                          <span className="chat_and_participants_body_msg_chil_hea_name">
                            {data.username}
                          </span>
                          <span className="chat_and_participants_body_msg_chil_hea_time">
                            {data.time}
                          </span>
                        </div>
                        <div className="chat_and_participants_body_msg_chil_body">
                          {data.message}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            }

            <form onSubmit={sendMessage} className="chat_and_participants_foot_master">
              {/* <div className="chat-body-end">
                <span>To</span>
                <div className="chat-body-end-Htag">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                    onClick={toggleVideo}
                    color={videoOff ? "secondary" : "default"}
                  >
                    <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                  </svg>
                  <span>Everyone</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                    onClick={toggleMic}
                    color={micMuted ? "secondary" : "default"}
                  >
                    <path d="M504-480L320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </svg>
                </div>
              </div> */}
              <input
                spellCheck={false}
                className="chat_and_participants_foot_input"
                type="text"
                name="user_message"
                placeholder="Send a message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleInputKeyPress}
              />
              <button type="submit" onClick={handleSendMessage} className="chat-footer-search-text-send">
                <IoMdSend className="chat-footer-search-text-sen-icon" />
              </button>
            </form>
          </>
        ) : (
          <div className="chat_participants_body_master">
            <h1 className="chat_participants_body_h1">Participants List</h1>
            <div className="chat_participants_body_participants_master">
              <span className="chat_participants_body_item">
                {username}
              </span>
              {peers?.map((data, index) => {

                return (
                  <div className="chat_participants_body_item"
                    key={index}
                    onClick={(e) => e.stopPropagation()}>
                    <span>
                      {data.username}
                    </span>
                    <div onClick={() => {
                      setActivePopupIndex(activePopupIndex === index ? null : index);
                    }} className="chat_participants_body_item_ico_master">
                      < BsThreeDots className="chat_participants_body_item_ico_child" />
                    </div>
                    {activePopupIndex === index &&
                      <div className='chat_participants_body_ite_popup'>
                        <div className="chat_participants_body_ite_popu_item">
                          Mute Microphone
                        </div>
                        <div className="chat_participants_body_ite_popu_item">
                          Mute Video
                        </div>
                        <div className="chat_participants_body_ite_popu_item">
                          Kick User
                        </div>
                        <div className="chat_participants_body_ite_popu_item">
                          Promote to Host
                        </div>
                      </div>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>


      {/* <footer className="footer">
        <div className="footer-left-content">
          <p>08:53 | Security Conference</p>
        </div>
        <div className="icons-bar"></div>
        <div className="footer-right-content">
        </div>
      </footer> */}
    </>
  );
};

export default VideoConference;
