import React, { createContext, useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export default AppContext;

export const Provider = ({ children }) => {
    let [loginloader, setLoginloader] = useState(false);
    const backendRoot = ''

    const navigate = useNavigate();
    let [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    let [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
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
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
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
            body: JSON.stringify({ refresh: authTokens.refresh }),
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            logoutUser();
            navigate("/login");
        }
    };

    useEffect(() => {
        let minutes = 1000 * 60 * 4;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, minutes);
        return () => clearInterval(interval);
    }, [authTokens]);

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        alert("Logout Successful");
    };

    const contextData = useMemo(() => ({
        test: "user123",
        user: user,
        logoutUser: logoutUser,
        loginUser: loginUser,
    }), [user, loginUser, logoutUser]);

    return (
        <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
    );
};
