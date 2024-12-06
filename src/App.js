import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";
import VideoCall from "./components/Video Call/VideoCall"
import VideoCallRoom from "./components/Video Call Room/Room";
import Chat from "./components/Chat/Chat";


function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/vc" element={<VideoCall />}/>
            <Route path="/Chat" element={<Chat/>}/>
            
          </Route>
          <Route path="/vc/room" element={<VideoCallRoom />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
