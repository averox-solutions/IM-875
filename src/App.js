import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";
import VideoCall from "./components/Video Call/VideoCall"
// import VideoCallRoom from "./components/Video Call Room/Room";


function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="/vc" element={<VideoCall />} /> */}
            {/* <Route path="/vc/room" element={<VideoCallRoom />} /> */}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/vc" element={<VideoCall />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
