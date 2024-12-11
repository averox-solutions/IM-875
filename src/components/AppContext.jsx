import React, { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const AppContext = createContext();

export default AppContext;

export const Provider = ({ children }) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_REST_URL;
  const [loginLoader, setLoginLoader] = useState(false);
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : null
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken") ? localStorage.getItem("refreshToken") : null
  );
  const [user, setUser] = useState(() =>
    accessToken ? jwtDecode(accessToken) : null
  );
  const [chatrooms, setChatrooms] = useState([]);
  const [chatroomsError, setChatroomsError] = useState(null);
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);

  const loginUser = async (e) => {
    e.preventDefault();
    if (!loginLoader) {
      setLoginLoader(true);
      const email = e.target?.email?.value;
      const password = e.target?.password?.value;

      let response = await fetch(`${REACT_APP_BACKEND_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json();

      if (response.ok) {
        setLoginLoader(false);
        setAccessToken(data.accessToken);
        setUser(jwtDecode(data.accessToken));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        // connectSocket(data.accessToken); // Connect socket on login
        navigate("/");
      } else {
        setLoginLoader(false);
        alert("Incorrect credentials");
      }
    }
  };

  const updateToken = useCallback(async () => {
    let response = await fetch(`${REACT_APP_BACKEND_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(jwtDecode(data.accessToken));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      logoutUser();
      navigate("/login");
    }
  }, [refreshToken, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken && refreshToken) {
        updateToken();
      }
    }, 1000 * 60 * 23);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, updateToken]);

  const logoutUser = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setSocket(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Logout Successful");
    navigate("/login");
  }, [navigate]);

  // Fetch chatrooms
  const fetchChatrooms = useCallback(async () => {
    if (!accessToken) {
      setChatroomsError("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/im/chatrooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatrooms(data.chats);
      } else {
        const errorData = await response.json();
        setChatroomsError(errorData?.message || "Failed to fetch chatrooms");
      }
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
      setChatroomsError(error.message);
    }
  }, [accessToken]);

  // Connect to WebSocket
  // const connectSocket = (token) => {
  //   const socketInstance = io(`${REACT_APP_BACKEND_URL}/im`, {
  //     query: { token },
  //   });

  //   socketInstance.on("connect", () => {
  //     console.log("Connected to WebSocket server.");
  //   });

  //   socketInstance.on("receiveMessage", (message) => {
  //     setMessages((prevMessages) => ({
  //       ...prevMessages,
  //       [message.chatroomId]: [...(prevMessages[message.chatroomId] || []), message],
  //     }));
  //   });

  //   socketInstance.on("disconnect", (reason) => {
  //     console.log("Disconnected from WebSocket server:", reason);
  //   });

  //   setSocket(socketInstance);
  // };

  useEffect(() => {
    if (accessToken) {
      // connectSocket(accessToken);
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [accessToken]);

  // Send a message
  const sendMessage = (chatroomId, content) => {
    const message = {
      chatroomId,
      content,
      senderId: user.id,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatroomId]: [...(prevMessages[chatroomId] || []), message],
    }));

    if (socket) {
      socket.emit("sendMessage", message);
    }
  };

  const contextData = useMemo(
    () => ({
      user,
      logoutUser,
      loginUser,
      accessToken,
      refreshToken,
      chatrooms,
      fetchChatrooms,
      chatroomsError,
      loginLoader,
      messages,
      sendMessage,
    }),
    [
      user,
      loginUser,
      logoutUser,
      accessToken,
      refreshToken,
      chatrooms,
      fetchChatrooms,
      chatroomsError,
      messages,
    ]
  );

  return <AppContext.Provider value={contextData}>{children}</AppContext.Provider>;
};
