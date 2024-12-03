import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';

// Create socket connection outside the component to prevent multiple connections
const socket = io('http://localhost:8080/vc', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});


function Socket() {
    let { user, accessToken } = useContext(AppContext);
    const location = useLocation();
    const [isConnected, setIsConnected] = useState(false);
    const [userId, setUserId] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [messageStatus, setMessageStatus] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const room_id = searchParams.get("room_id")

    // Mock username (you can replace this with actual user data later)
    const USERNAME = 'John Doe';

    useEffect(() => {
        // Extract room_id from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const room_id = queryParams.get('room_id');

        // Connection event with user identification
        socket.on('vc_connected', (data) => {
            setIsConnected(true);
            console.log('Connected to WebSocket server', {
                accessToken: accessToken,
                socket_id: data.socket_id,
                room_id: room_id,
            });
        });

        // If room_id exists, emit a room join event when connection is established
        if (room_id) {
            socket.emit('join_room', {
                room_id: room_id,
                username: USERNAME,
                accessToken: accessToken,
            });
        }

        // Existing event listeners...
        socket.on('disconnect', () => {
            setIsConnected(false);
            setUserId(null);
            console.log('Disconnected from WebSocket server');
        });

        socket.on('message', (data) => {
            console.log('Received message:', data);
        });

        socket.on('user_joined', (data) => {
            console.log('User Joined:', data.username);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('vc_connected');
            socket.off('disconnect');
            socket.off('message');
        };
    }, [location.search]);

    // Rest of the component remains the same...

    return (
        <div>
            {room_id && (
                <div className="bg-green-100 p-3 rounded mt-4">
                    <p>Connected to Room:
                        <span className="ml-2 font-bold text-green-700">{room_id}</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Socket;