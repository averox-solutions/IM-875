import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';
import VideoConference from './Video Metting Screen/VideoConference';


function Conversation(props) {
    let { user, accessToken } = useContext(AppContext);
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        room_id,
        socket,
        hasJoined,
        setHasJoined,
        username,
        setUsername,
        isVideoMuted,
        isAudioMuted,
        setIsVideoMuted,
        setIsAudioMuted,
        peers,
        setPeers,
        localVideoRef,
        localStream,
        setLocalStream,
    } = props;

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
        // Destroy all peer connections
        peers.forEach(({ peer }) => {
            if (peer) {
                try {
                    peer.destroy();
                } catch (error) {
                    console.error('Error destroying peer:', error);
                }
            }
        });

        if (room_id) {
            socket.emit('leave_room', {
                room_id: room_id,
                username: username
            }, (response) => {
                // Log the callback acknowledgement
                console.log('You have left the room');
                setPeers([]); // Clear peers
                setHasJoined(false)
            });
        }

        // Stop local stream tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    };

    // Get local media stream
    const getMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Signal readiness to join room
            socket.emit('join_room', {
                room_id,
                username,
                accessToken
            });
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    useEffect(() => {
        getMediaStream();
        // Extract room_id from URL query parameters
        const queryParams = new URLSearchParams(location.search);

        socket.on('receive_message', (data) => {
            console.log(`${data.username}:`, data.message);
        });

        socket.on('user_joined_signal', (data) => {
            const peer = addPeer(data.signal, data.new_user_socket_id, localStream)
            setPeers(users => [...users, {
                peer_id: data.new_user_socket_id,
                username: data.username,
                peer
            }]);

            console.log(data?.username, 'has joined the room');
        });

        socket.on('user_joined', (data) => {
            // console.log(data?.username, 'has joined the room');
        });

        socket.on('receiving_returned_signal', (data) => {
            const item = peers.find(p => p.peer_id === data.socket_id)
            item.peer.signal(data.signal)


            // const peer = addPeer(data.signal, data.socket_id, localStream)
            // setPeers(users => [...users, {
            //     peer_id: data.socket_id,
            //     peer
            // }]);

            // console.log(data?.username, 'has joined the room');
        });

        socket.on('user_left', (data) => {
            // Remove the peer when a user leaves
            setPeers(currentPeers => {
                const updatedPeers = currentPeers.filter(p => p.peer_id !== data.socket_id);

                // Destroy the specific peer connection
                const removedPeer = currentPeers.find(p => p.peer_id === data.socket_id);
                if (removedPeer && removedPeer.peer) {
                    try {
                        removedPeer.peer.destroy();
                    } catch (error) {
                        console.error('Error destroying peer:', error);
                    }
                }

                return updatedPeers;
            });

            console.log(data?.username, 'has left the room');
        });


        // Cleanup on component unmount
        return () => {
            socket.off('receive_message');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('user_joined_signal');
            socket.off('receiving_returned_signal');

            // Destroy all peer connections
            peers.forEach(({ peer }) => {
                if (peer) {
                    try {
                        peer.destroy();
                    } catch (error) {
                        console.error('Error destroying peer:', error);
                    }
                }
            });

            // Stop local stream tracks
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }
        };
    }, [location.search]);

    // Toggle video mute
    const toggleVideoMute = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoMuted(!videoTrack.enabled);
        }
    };

    // Toggle audio mute
    const toggleAudioMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioMuted(!audioTrack.enabled);
        }
    };

    function addPeer(incomingSignal, new_user_socket_id, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on('signal', signal => {
            socket.emit('returning_signal', {
                new_user_socket_id: new_user_socket_id,
                signal: signal
            });
        });

        peer.on('error', (err) => {
            console.error('Peer connection error:', err);
            // Remove the peer from the list on error
            setPeers(currentPeers =>
                currentPeers.filter(p => p.peer_id !== new_user_socket_id)
            );
        });

        peer.signal(incomingSignal)

        return peer;
    }

    return (
        <div>
            {room_id && (
                <>

                    {
                        peers &&
                        < VideoConference
                            room_id={room_id}
                            username={username}
                            localVideoRef={localVideoRef}
                            isVideoMuted={isVideoMuted}
                            isAudioMuted={isAudioMuted}
                            sendMessage={sendMessage}
                            toggleVideoMute={toggleVideoMute}
                            toggleAudioMute={toggleAudioMute}
                            peers={peers}
                            handleLeaveRoom={handleLeaveRoom}
                        />
                    }

                    {/* <div className="bg-green-100 p-3 rounded mt-4 flex justify-between items-center">
                        <p>Connected to Room:
                            <span className="ml-2 font-bold text-green-700">{room_id}</span>
                            {" "}
                            as
                            {" "}
                            <span className="ml-2 font-bold text-green-700">{username}</span>
                        </p>
                        <form style={{ width: "200px", marginTop: "10px" }} onSubmit={sendMessage}>
                            <input name='user_message' placeholder='Type Message' type='text' />
                            <button type='submit'>
                                Submit
                            </button>
                        </form>
                    </div>




                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '256px',
                            height: '192px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)'
                                }}
                            />
                            {isVideoMuted && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: '#6B7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    Video Muted
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '16px'
                        }}>
                            <button
                                onClick={toggleVideoMute}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: isVideoMuted ? '#EF4444' : '#F3F4F6'
                                }}
                            >
                                {isVideoMuted ? <HiVideoCameraSlash color="white" /> : <HiVideoCamera />}
                            </button>
                            <button
                                onClick={toggleAudioMute}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: isAudioMuted ? '#EF4444' : '#F3F4F6'
                                }}
                            >
                                {isAudioMuted ? <IoMdMicOff color="white" /> : <IoMdMic />}
                            </button>
                            <button
                                onClick={handleLeaveRoom}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: '#EF4444',
                                    color: 'white'
                                }}
                            >
                                Leave Room
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '16px'
                        }}>
                            {peers?.map(({ peer, peerID }) => {
                                return (
                                    <RemotePeer peerID={peerID} key={peerID} peer={peer} />
                                )
                            })}
                        </div>
                    </div > */
                    }
                </>
            )}
        </div >
    );
}

export default Conversation;




function RemotePeer({ peer, peerID }) {
    const remoteVideoRef = useRef(null);

    // useEffect(() => {
    //     if (peer) {
    //         peer.on('stream', stream => {
    //             if (remoteVideoRef.current) {
    //                 remoteVideoRef.current.srcObject = stream;
    //             }
    //         });
    //     }
    // }, [peer]);

    useEffect(() => {
        if (peer) {
            peer.on('stream', stream => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
            });

            peer.on('error', (err) => {
                console.error(`Peer connection error for peer ${peerID}:`, err);
            });
        }
    }, [peer, peerID]);

    return (
        <div key={peerID} style={{
            width: '256px',
            height: '192px',
            backgroundColor: '#E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            <video
                ref={remoteVideoRef}
                autoPlay
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
}