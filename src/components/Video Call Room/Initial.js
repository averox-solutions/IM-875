import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';

function Initial(props) {
    let { user, accessToken } = useContext(AppContext);
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { room_id, socket, setHasJoined, username, setUsername } = props

    const joinRoom = async (e) => {
        e.preventDefault()

        if (room_id) {
            socket.emit('join_room', {
                room_id: room_id,
                username: e.target.user_message.value.trim(),
                accessToken: accessToken,
            }, (response) => {
                // Log the join room callback
                setHasJoined(true)
                console.log('You have joined the room');
            });
        }
    }
    //     // Extract room_id from URL query parameters
    //     const queryParams = new URLSearchParams(location.search);
    //     const room_id = queryParams.get('room_id');

    //     // Connection event with user identification
    //     socket.on('vc_connected', (data) => {
    //         // console.log('Connected to Voice Chat Server', {
    //         //     accessToken: accessToken,
    //         //     socket_id: data.socket_id,
    //         //     room_id: room_id,
    //         // });
    //         console.log('socket connected')
    //     });

    //     // Existing event listeners...
    //     socket.on('disconnect', () => {
    //         console.log('disconnected')
    //         // setIsConnected(false);
    //         // setUserId(null);
    //         // console.log('Disconnected from WebSocket server');
    //     });

    //     socket.on('receive_message', (data) => {
    //         console.log(`${data.username}:`, data.message);
    //     });

    //     socket.on('user_joined', (data) => {
    //         console.log(data?.username, 'has joined the room');
    //     });

    //     socket.on('user_left', (data) => {
    //         console.log(data?.username, 'has left the room');
    //     });

    //     // Cleanup on component unmount
    //     return () => {
    //         socket.off('vc_connected');
    //         socket.off('disconnect');
    //         socket.off('message');
    //         socket.off('user_left');
    //         socket.off('user_joined');
    //         socket.off('join_room');
    //     };
    // }, [location.search]);

    return (
        <>
            <form style={{ width: "200px", marginTop: "10px" }} onSubmit={joinRoom}>
                <input onChange={(e) => { setUsername(e.target.value) }} value={username} required name='user_message' placeholder='Your Name' type='text' />
                <button type='submit'>
                    Join
                </button>
            </form>
        </>
    );
}

export default Initial;