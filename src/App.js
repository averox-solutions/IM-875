import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";

import Chat from "./components/Chat/Chat";

import './style.css'


function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
        

          </Route>
         
          <Route path="/login" element={<Login />} />
          
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
