import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';
import Initial from './Initial'
import Conversation from './Conversation'

// Create socket connection outside the component to prevent multiple connections
const socket = io('http://localhost:8080/vc', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

function Socket() {
    let { user, accessToken } = useContext(AppContext);

    const location = useLocation();

    const [hasJoined, setHasJoined] = useState(false);
    const [username, setUsername] = useState(user?.username ? user?.username : "");

    const [searchParams, setSearchParams] = useSearchParams();
    const room_id = searchParams.get("room_id")


    useEffect(() => {
        socket.on('vc_connected', (data) => {

        });

        socket.on('disconnect', () => {

        });

        // Cleanup on component unmount
        return () => {
            socket.off('vc_connected');
            socket.off('disconnect');
        };
    }, [location.search]);

    return (
        <>
            {hasJoined ?
                <Conversation username={username} setUsername={setUsername} socket={socket} room_id={room_id} hasJoined={hasJoined} setHasJoined={setHasJoined} />
                :
                <Initial username={username} setUsername={setUsername} socket={socket} room_id={room_id} hasJoined={hasJoined} setHasJoined={setHasJoined} />
            }
        </>
    );
}

export default Socket;