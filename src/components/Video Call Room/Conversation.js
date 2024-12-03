import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';

function Conversation(props) {
    let { user, accessToken } = useContext(AppContext);
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { room_id, socket, username, setHasJoined, hasJoined } = props

    const sendMessage = async (e) => {
        e.preventDefault()

        console.log(`${username}:`, e.target.user_message.value.trim())

        if (room_id) {
            socket.emit('send_message', {
                room_id: room_id,
                message: e.target.user_message.value.trim(),
                username: username,
                accessToken: accessToken
            }, (response) => {

            });
        }
    }

    // Function to handle leaving the room
    const handleLeaveRoom = () => {
        if (room_id) {
            socket.emit('leave_room', {
                room_id: room_id,
                username: username
            }, (response) => {
                // Log the callback acknowledgement
                console.log('You have left the room');
                setHasJoined(false)
            });
        }
    };

    useEffect(() => {
        // Extract room_id from URL query parameters
        const queryParams = new URLSearchParams(location.search);

        socket.on('receive_message', (data) => {
            console.log(`${data.username}:`, data.message);
        });

        socket.on('user_joined', (data) => {
            console.log(data?.username, 'has joined the room');
        });

        socket.on('user_left', (data) => {
            console.log(data?.username, 'has left the room');
        });


        // Cleanup on component unmount
        return () => {
            socket.off('receive_message');
            socket.off('user_joined');
            socket.off('user_left');
        };
    }, [location.search]);

    return (
        <div>
            {room_id && (
                <div className="bg-green-100 p-3 rounded mt-4 flex justify-between items-center">
                    <p>Connected to Room:
                        <span className="ml-2 font-bold text-green-700">{room_id}</span>
                        {" "}
                        as
                        {" "}
                        <span className="ml-2 font-bold text-green-700">{username}</span>
                    </p>
                    <button
                        onClick={handleLeaveRoom}
                    >
                        Leave Room
                    </button>
                    <form style={{ width: "200px", marginTop: "10px" }} onSubmit={sendMessage}>
                        <input name='user_message' placeholder='Type Message' type='text' />
                        <button type='submit'>
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Conversation;