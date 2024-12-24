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
import { FaRegCopy } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";


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
    toggleScreenShare,
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
    isHost,
    setIsHost,
    muteUserMic,
    muteUserVideo,
    kickUser,
    promoteToHost,
    demoteToViewer,
    setActivePopupIndex,
    activePopupIndex,
    isOwner,
    setIsOwner,
    endMeetingForAll,
    muteAllVideo,
    muteAllMic,
    screenStream,
    setScreenStream,
    screenPeers,
    setScreenPeers,
    screenPeerRef,
  } = props

  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [firstSearchItem, setFirstSearchItem] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatView, setChatView] = useState('chat')
  const [msgsActive, setMsgsActive] = useState(false);

  const toggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  const handleInputChange = (e) => {
    setFirstSearchItem(e.target.value);
  };
  const [activeList, setActiveList] = useState(null);

  const navigateTo = useNavigation();


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
      {/* <div id='vc_header_master'>
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
      </div> */}

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

      <div className="vc_participant_controls">
        <div className="vc_participant_control_child">
          {isHost && <div id="vc_participant_control_chil_popup">
            {(isOwner || (isHost && !peers.some(peer => peer.is_owner === true))) &&
              <div onClick={endMeetingForAll} className="vc_participant_control_chil_popu_item">
                End Meeting
              </div>
            }
            <div onClick={muteAllMic} className="vc_participant_control_chil_popu_item">Mute All Microphone</div>
            <div onClick={muteAllVideo} className="vc_participant_control_chil_popu_item">Mute All Video</div>
          </div>
          }
          <button
            style={{ background: isVideoMuted ? 'white' : "var(--btn-primary)" }}
            onClick={toggleVideoMute}
            className="vc_participant_control_btns"
          >
            {isVideoMuted ?
              <HiVideoCameraSlash className="vc_participant_control_btn_icon" />
              :
              <HiVideoCamera style={{ color: "white" }} className="vc_participant_control_btn_icon" />
            }
          </button>
          <button
            style={{ background: isAudioMuted ? 'white' : "var(--btn-primary)" }}
            onClick={toggleAudioMute}
            className="vc_participant_control_btns"
          >
            {isAudioMuted ?
              <IoMdMicOff className="vc_participant_control_btn_icon" />
              :
              <IoMdMic style={{ color: "white" }} className="vc_participant_control_btn_icon" />
            }
          </button>
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
            style={screenShare ? { background: "rgb(80,80,80)" } : {}}
            onClick={toggleScreenShare}
            className="vc_participant_control_btns"
          >
            {screenShare ?
              <LuScreenShareOff style={screenShare ? { color: "white" } : {}} className="vc_participant_control_btn_icon" />
              :
              <LuScreenShare className="vc_participant_control_btn_icon" />
            }
          </button>

          <button
            style={handRaise ? { background: "rgb(80,80,80)" } : {}}
            onClick={handleHandRaise}
            className="vc_participant_control_btns"
          >
            {handRaise ?
              <IoHandRightOutline style={handRaise ? { color: "white" } : {}} className="vc_participant_control_btn_icon" />
              :
              <IoHandRightSharp className="vc_participant_control_btn_icon" />
            }
          </button>

          {isHost && <button
            onClick={() => {
              document.getElementById("vc_participant_control_chil_popup")?.classList?.toggle('active')
            }}
            className="vc_participant_control_btns"
          >
            <BsThreeDots className="vc_participant_control_btn_icon" />
          </button>}

          <button style={{ background: "rgb(230,0,0)" }} className="vc_participant_control_btns" onClick={handleLeaveRoom}>
            <ImPhoneHangUp style={{ color: "white" }} className="vc_participant_control_btn_icon" />
          </button>
        </div>

        <div id='vc_footer_bots'>
          <div
            style={msgsActive ? { background: "rgb(230,230,230)" } : {}}
            onClick={() => {
              setMsgsActive(!msgsActive)
              document.getElementById('vc_participants_master').classList.toggle('active')
              document.getElementById('chat_and_participants_master').classList.toggle('active')
            }} className="vc_head_bot_btn_ico_master">
            <LuMessageSquareText style={msgsActive ? { color: "black" } : {}} className='vc_head_bot_btn_icon' />
          </div>
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
          }} className="vc_head_bot_btn_ico_master">
            <MdContentCopy className='vc_head_bot_btn_icon' />
          </div>
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
        screenStream={screenStream}
        setScreenStream={setScreenStream}
        screenPeers={screenPeers}
        setScreenPeers={setScreenPeers}
        screenPeerRef={screenPeerRef}
      />

      <div id="chat_and_participants_master">
        <div className="chat_and_participants_btn_master">
          <div className="chat_and_participants_btn_child">
            <div onClick={() => {
              setChatView('chat')
            }} style={{
              boxShadow: chatView == 'chat' ? "0px 1px 2px -1px rgba(9, 9, 11, 0.1), 0px 1px 3px 0px rgba(9, 9, 11, 0.1)" : "",
              background: chatView == 'chat' ? 'white' : ''
            }} className="chat_and_participants_btn_chil_item">
              Chat
            </div>
            <div onClick={() => {
              setChatView('participants')
            }} style={{
              boxShadow: chatView == 'participants' ? "0px 1px 2px -1px rgba(9, 9, 11, 0.1), 0px 1px 3px 0px rgba(9, 9, 11, 0.1)" : "",
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
              <div className="chat_and_participants_foot_child">
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
              </div>
            </form>
          </>
        ) : (
          <div className="chat_participants_body_master">
            {/* <h1 className="chat_participants_body_h1">Participants List</h1> */}
            <div className="chat_participants_body_participants_master">
              <span className="chat_participants_body_item">
                <span>
                  {username}
                  {isOwner && isHost && <span style={{ marginLeft: "7px", fontWeight: "600", fontSize: "10px", color: "var(--btn-primary)" }}>OWNER</span>}
                  {isHost && !isOwner && <span style={{ marginLeft: "7px", fontWeight: "600", fontSize: "10px", color: "var(--btn-primary)" }}>HOST</span>}
                </span>
              </span>
              {peers?.map((data, index) => {

                return (
                  <div className="chat_participants_body_item"
                    key={index}
                    onClick={(e) => e.stopPropagation()}>
                    <span>
                      {data.username}
                      {data.is_owner && data.is_host && <span style={{ marginLeft: "7px", fontWeight: "600", fontSize: "10px", color: "var(--btn-primary)" }}>OWNER</span>}
                      {data.is_host && !data.is_owner && <span style={{ marginLeft: "7px", fontWeight: "600", fontSize: "10px", color: "var(--btn-primary)" }}>HOST</span>}
                    </span>
                    {((isHost && !data.is_owner && !data.is_host) || (isOwner)) &&
                      <div onClick={() => {
                        setActivePopupIndex(activePopupIndex === index ? null : index);
                      }} className="chat_participants_body_item_ico_master">
                        < BsThreeDots className="chat_participants_body_item_ico_child" />
                      </div>
                    }
                    {(activePopupIndex === index && ((isHost && !data.is_owner && !data.is_host) || isOwner)) &&
                      <div className='chat_participants_body_ite_popup'>
                        {!data.audioMuted && <div onClick={() => { muteUserMic(data) }} className="chat_participants_body_ite_popu_item">
                          Mute Microphone
                        </div>}
                        {!data.videoMuted && <div onClick={() => { muteUserVideo(data) }} className="chat_participants_body_ite_popu_item">
                          Mute Video
                        </div>}
                        <div onClick={() => { kickUser(data) }} className="chat_participants_body_ite_popu_item">
                          Kick User
                        </div>
                        {!data.is_host && isOwner && <div onClick={() => { promoteToHost(data) }} className="chat_participants_body_ite_popu_item">
                          Promote to Host
                        </div>
                        }
                        {data.is_host && isOwner && <div onClick={() => { demoteToViewer(data) }} className="chat_participants_body_ite_popu_item">
                          Demote to Viewer
                        </div>
                        }
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
