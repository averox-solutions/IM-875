import React, { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export default AppContext;
export const Provider = ({ children }) => {
  const [loginLoader, setLoginLoader] = useState(false);
  const backendRoot = 'https://1cb9-182-180-55-138.ngrok-free.app'; 
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

  const loginUser = async (e) => {
    e.preventDefault();
    if(!loginLoader){
        setLoginLoader(true)
        const email = e.target?.email?.value;
        const password = e.target?.password?.value;
      
        // Proceed with the API call if email and password are available
        let response = await fetch(`${backendRoot}/auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
      
        let data = await response.json();
      
        if (response.ok) {
          setLoginLoader(false);
          setAccessToken(data.accessToken);
          setUser(jwtDecode(data.accessToken));
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken); // Save refreshToken too
          navigate("/");
        } else {
          setLoginLoader(false);
          alert("Incorrect credentials");
        }
    }
  };
  


  const updateToken = useCallback(async () => {
    let response = await fetch(`${backendRoot}/auth/refresh/`, {
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
      localStorage.setItem("refreshToken", data.refreshToken); // Save refreshToken too
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
    }, 1000 * 60 * 23); // Run every 23 minutes

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, updateToken]);

  const logoutUser = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Logout Successful");
    navigate("/login");
  }, [navigate]);

  const contextData = useMemo(
    () => ({
      test: "user123",
      user: user,
      logoutUser: logoutUser,
      loginUser: loginUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
      loginLoader:loginLoader
    }),
    [user, loginUser, logoutUser, accessToken, refreshToken]  // Include loginUser and logoutUser here
  );

  return <AppContext.Provider value={contextData}>{children}</AppContext.Provider>;
};
