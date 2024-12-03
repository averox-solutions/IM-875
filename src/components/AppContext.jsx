import React, { createContext, useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export default AppContext;

export const Provider = ({ children }) => {
    let [loginloader, setLoginloader] = useState(false);

    const backendRoot = ''

    const navigate = useNavigate();

    let [accessToken, setAccessToken] = useState(() =>
        localStorage.getItem("accessToken")
            ? localStorage.getItem("accessToken")
            : null
    );

    let [refreshToken, setRefreshToken] = useState(() =>
        localStorage.getItem("refreshToken")
            ? localStorage.getItem("refreshToken")
            : null
    );

    let [user, setUser] = useState(() =>
        localStorage.getItem("accessToken")
            ? jwtDecode(localStorage.getItem("accessToken"))
            : null
    );


    let loginUser = async (e) => {
        if (loginloader == false) {
            setLoginloader(true);
            e.preventDefault();
            let response = await fetch(`${backendRoot}/auth/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: e.target.email.value,
                    password: e.target.password.value,
                }),
            });
            let data = await response.json();

            if (response.status === 200) {
                setLoginloader(false);
                setAccessToken(data.accessToken);
                setUser(jwtDecode(data.accessToken));
                localStorage.setItem("accessToken", JSON.stringify(data));
                navigate("/");
            } else {
                setLoginloader(false);
                alert("incorrect credentials");
            }
        }
    };

    let updateToken = async () => {
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
            setRefreshToken(data.refreshToken)
            setUser(jwtDecode(data.accessToken));
            localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        } else {
            logoutUser();
            navigate("/login");
        }
    };

    useEffect(() => {
        let minutes = 1000 * 60 * 24;
        let interval = setInterval(() => {
            if (accessToken && refreshToken) {
                updateToken();
            }
        }, minutes);
        return () => clearInterval(interval);
    }, [accessToken]);

    let logoutUser = () => {
        setAccessToken(null);
        setRefreshToken(null)
        setUser(null);
        localStorage.removeItem("authTokens");
        alert("Logout Successful");
    };

    const contextData = useMemo(() => ({
        test: "user123",
        user: user,
        logoutUser: logoutUser,
        loginUser: loginUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
    }), [user, loginUser, logoutUser]);

    return (
        <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
    );
};
