import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Create socket connection outside the component to prevent multiple connections
const socket = io('http://localhost:8080/vc', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

function Socket() {
    const [isConnected, setIsConnected] = useState(false);
    const [userId, setUserId] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [messageStatus, setMessageStatus] = useState(null);

    useEffect(() => {
        // Connection event with user identification
        socket.on('user_connected', (data) => {
            setIsConnected(true);
            setUserId(data.userId);
            console.log('Connected to WebSocket server', {
                userId: data.userId,
                socketId: data.socketId
            });
        });

        // Disconnect event
        socket.on('disconnect', () => {
            setIsConnected(false);
            setUserId(null);
            console.log('Disconnected from WebSocket server');
        });

        // Message event
        socket.on('message', (data) => {
            console.log('Received message:', data);
            setLastMessage(data);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('user_connected');
            socket.off('disconnect');
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        // Send message with acknowledgement callback
        socket.emit('message', {
            text: 'Message from React Frontend'
        }, (response) => {
            // Handle server acknowledgement
            console.log('Message acknowledgement:', response);
            setMessageStatus(response);
        });
    };

    return (
        <div className="p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold mb-4">Socket.IO Connection Test</h2>
            <div className="mb-4">
                <p>Connection Status:
                    <span className={`ml-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </p>
                {userId && (
                    <p>User ID:
                        <span className="ml-2 text-blue-600">{userId}</span>
                    </p>
                )}
            </div>
            <div className="mb-4">
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={!isConnected}
                >
                    Send Test Message
                </button>
            </div>
            {lastMessage && (
                <div className="bg-white p-3 rounded shadow mb-4">
                    <h3 className="font-bold">Last Message:</h3>
                    <pre className="text-sm">{JSON.stringify(lastMessage, null, 2)}</pre>
                </div>
            )}
            {messageStatus && (
                <div className="bg-gray-200 p-3 rounded">
                    <h3 className="font-bold">Message Status:</h3>
                    <pre className="text-sm">{JSON.stringify(messageStatus, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Socket;