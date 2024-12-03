import React from 'react'
import { useState, useEffect, useContext, useRef } from "react";
import AppContext from "../AppContext";

const Login = () => {
    let { test } = useContext(AppContext);
    return <div>Login-{test}</div>;
}

export default Login