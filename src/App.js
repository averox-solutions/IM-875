import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";
import Socket from "./components/Socket/Socket";
import VideoCall from "./components/Video Call/VC";
import Rooms from "./components/Rooms/RoomNavbar";

function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/vc" element={<VideoCall />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/socket" element={<Socket />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
