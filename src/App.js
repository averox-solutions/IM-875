import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";
import VideoCall from "./components/Video Call/VideoCall";
import VideoCallRoom from "./components/Video Call Room/Room";
import Chat from "./components/Chat/Chat";
// import VideoConference from "./components/Video Metting Screen/VideoConference";
// import BeepVideoCall from "./components/Video Metting Screen/BeepVideoCall";
import Profile from "./components/Video Call/Profile";
import './style.css'
import Setting from "./components/Video Call/Setting";


function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/vc" element={<VideoCall />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="setting" element={<Setting />} />
          </Route>
          <Route path="/vc/room" element={<VideoCallRoom />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/meetingscreen" element={<VideoConference />} /> */}
          {/* <Route path="/Beepmeetingscreen" element={<BeepVideoCall />} /> */}
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
