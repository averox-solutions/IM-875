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

    // Function to handle leaving the room
    const handleLeaveRoom = () => {
        if (room_id) {
            socket.emit('leave_room', {
                room_id: room_id,
                username: user?.username
            }, (response) => {
                // Log the callback acknowledgement
                console.log('You have left the room');

                // Optional: Clear the room_id from URL if needed
                searchParams.delete('room_id');
                setSearchParams(searchParams);
            });
        }
    };

    useEffect(() => {
        // Extract room_id from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const room_id = queryParams.get('room_id');

        // Connection event with user identification
        socket.on('vc_connected', (data) => {
            // console.log('Connected to Voice Chat Server', {
            //     accessToken: accessToken,
            //     socket_id: data.socket_id,
            //     room_id: room_id,
            // });
        });

        // If room_id exists, emit a room join event when connection is established
        if (room_id) {
            socket.emit('join_room', {
                room_id: room_id,
                username: user?.username,
                accessToken: accessToken,
            }, (response) => {
                // Log the join room callback
                console.log('You have joined the room');
            });
        }

        // Existing event listeners...
        socket.on('disconnect', () => {
            // setIsConnected(false);
            // setUserId(null);
            // console.log('Disconnected from WebSocket server');
        });

        socket.on('message', (data) => {
            console.log('Received message:', data);
        });

        socket.on('user_joined', (data) => {
            console.log(data?.username, 'has joined the room');
        });

        socket.on('user_left', (data) => {
            console.log(data?.username, 'has left the room');
        });

        // Cleanup on component unmount
        return () => {
            socket.off('vc_connected');
            socket.off('disconnect');
            socket.off('message');
            socket.off('user_left');
            socket.off('user_joined');
            socket.off('join_room');
        };
    }, [location.search]);

    return (
        <div>
            {room_id && (
                <div className="bg-green-100 p-3 rounded mt-4 flex justify-between items-center">
                    <p>Connected to Room:
                        <span className="ml-2 font-bold text-green-700">{room_id}</span>
                    </p>
                    <button
                        onClick={handleLeaveRoom}
                    >
                        Leave Room
                    </button>
                </div>
            )}
        </div>
    );
}

export default Socket;