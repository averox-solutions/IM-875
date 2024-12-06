import React, { useState } from 'react';
import "./chat.css";
import { FaSearch } from "react-icons/fa";
import Chatsection from './Chatsection';

const userData = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey there! How's it going?",
    time: "2:30 PM",
    val:34,
    image: "https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg?w=740"
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Check out this cool feature!",
    time: "1:45 PM",
    val:34,
    image: "https://img.freepik.com/free-photo/young-happy-woman_1157-23871.jpg?w=740"
  },
  {
    id: 3,
    name: "Alice Johnson",
    lastMessage: "Looking forward to our meeting.",
    time: "12:30 PM",
    image: "https://img.freepik.com/free-photo/young-happy-woman_1157-23871.jpg?w=740"
  },
  {
    id: 4,
    name: "Bob Brown",
    lastMessage: "Let's catch up this weekend.",
    time: "11:15 AM",
    image: "https://img.freepik.com/free-photo/businessman-with-arms-crossed_1157-15122.jpg?w=740"
  },
  {
    id: 5,
    name: "Emily Davis",
    lastMessage: "I've sent you the report.",
    time: "10:00 AM",
    image: "https://img.freepik.com/free-photo/businesswoman-with-arms-crossed_1157-18065.jpg?w=740"
  },
];

const zoneData = [
  {
    id: 1,
    name: "Group 1",
    lastMessage: "Let's meet at 3 PM.",
    time: "2:45 PM",
    user: {
      name: "Alice Johnson",
      profilePic: "https://img.freepik.com/free-photo/young-happy-woman_1157-23871.jpg?w=740"
    },
    members: [
      "https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg?w=740",
      "https://img.freepik.com/free-photo/portrait-smiling-woman_1157-45469.jpg?w=740",
      "https://img.freepik.com/free-photo/young-happy-woman_1157-23871.jpg?w=740",
    ],
  },
  {
    id: 2,
    name: "Group 2",
    lastMessage: "Project update: all tasks completed.",
    time: "11:30 AM",
    user: {
      name: "Bob Brown",
      profilePic: "https://img.freepik.com/free-photo/businessman-with-arms-crossed_1157-15122.jpg?w=740"
    },
    members: [
      "https://img.freepik.com/free-photo/businessman-with-arms-crossed_1157-15122.jpg?w=740",
      "https://img.freepik.com/free-photo/businesswoman-with-arms-crossed_1157-18065.jpg?w=740",
    ],
  },
];

const Chat = () => {
  const [input, setInput] = useState("");
  const [active, setActive] = useState('chats');
  const [chats, setChats] = useState([]);

  const handleToggle = (option) => {
    setActive(option);
  };

  const filteredUserData = userData.filter(user =>
    user.name.toLowerCase().includes(input.toLowerCase()) ||
    user.lastMessage.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className='Container'>

      <div className="nav-left">
        
        {/* <div className="top-items">
          <div className="user-log-container">
            <img src="./Images/image.png" alt="" className="user-logo-img" />
          </div>
          <div className="comunity-section">
            <button style={{border:"none"}} className="button-t">
              <ChatIcon style={{ height: ".76em", width: "0.76em", color: "#488D41" }} />
            </button>
            <button style={{border:"none"}} className=" button-t">
              <PeopleIcon style={{ height: ".76em", width: "0.76em", color: "#488D41" }} />
            </button>
            <button style={{border:"none"}} className="button-t">
              <MoreVertIcon style={{ height: ".76em", width: "0.76em", color: "#488D41" }} />
            </button>
          </div>
        </div> */}
        <div className="search-container">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              placeholder="Type to search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* <FilterListIcon style={{ height: ".76em", width: "0.76em" }} className='.icon' /> */}
        </div>
        <div className="toggle-container">
          <div
            className={`toggle-option ${active === 'chats' ? 'active' : ''}`}
            onClick={() => handleToggle('chats')}
          >
            Chats
          </div>
          <div
            className={`toggle-option ${active === 'zones' ? 'active' : ''}`}
            onClick={() => handleToggle('zones')}
          >
            Zones
          </div>
        </div>
        <div className="chats-user-container">
          {active === 'chats' ? (
            filteredUserData.length > 0 ? (
              filteredUserData.map(user => (
                <div key={user.id} className="user-container">
                  <div className="userinfo">
                    <img src={user.image} alt="" className="profile-pic" />
                    <div className="username">
                      <span className='name'>{user.name}</span>
                      <div className="text-container">
                        <span className="last-message">{user.lastMessage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="time">
                    <span>{user.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-chat">
                <img src="./images/illustration.svg" className='img-right' alt="" />
                <p>No chats available</p>
              </div>
            )
          ) : active === 'zones' ? (
            zoneData.length > 0 ? (
              zoneData.map(zone => (
                <div key={zone.id} className="zone-container">
                  <div className="zone-info">
                    <div className="profile-pics-container">
                      {zone.members.slice(0, 1).map((member, index) => (
                        <img
                          key={index}
                          src={member}
                          alt={`Member ${index}`}
                          className={`zone-profile-pic ${index > 0 ? 'overlay' : ''}`}
                        />
                      ))}
                    </div>
                        <div className="zone-info-container">
                        <span className="zone-name">{zone.name}</span>
                        <div className="text-container">
                        <span className="last-message">{zone.lastMessage}</span>
                      </div> 
                       </div>
                      <div className="time">
                    <span>{zone.time}</span>
                       </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="no-zone">
                <img src="./images/illustration.svg" className='img-right' alt="" />
                <p>No zones available</p>
              </div>
            )
          ) : (
            <div className="no-chat">
              <img src="./images/illustration.svg" className='img-right' alt="" />
              <p>Select a view to start</p>
            </div>
          )}
        </div>
      </div>
      <div className="nav-right">
      <Chatsection chats={chats} isZoneActive={active === 'zones' ? 'true' : 'false'}/>
      </div>
    </div>
  );
}

export default Chat;
