import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { useLocation, useSearchParams } from 'react-router-dom';
import AppContext from '../AppContext';
import VideoConference from './Video Metting Screen/VideoConference';
import { useNavigationType } from 'react-router-dom';



function Conversation(props) {
    const navigationType = useNavigationType();
    let { user, accessToken } = useContext(AppContext);
    const location = useLocation();
    const isFirstRender = useRef(true);
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
        messageList,
        setMessageList,
        setScreenShare,
        screenShare,
        screenRecording,
        setScreenRecording,
        handRaise,
        setHandRaise,
        inMeetingNotification,
        activePopupIndex,
        setActivePopupIndex,
        setInMeetingNotification,
        setIsHost,
        isHost,
        isOwner,
        setIsOwner,
    } = props;
    const [userMessage, setUserMessage] = useState('')
    const notificationTimeoutRef = useRef(null);

    const [handRaiseList, setHandRaiseList] = useState([])

    const sendMessage = async (e) => {
        e.preventDefault();

        const item = userMessage.trim();
        if (!item) return; // Avoid sending empty messages

        // Reset the user input
        setUserMessage('');

        // Get the current time in Pakistan Standard Time
        const timeFormatter = new Intl.DateTimeFormat('en-PK', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Asia/Karachi'
        });
        const currentTime = timeFormatter.format(new Date());

        // Create the payload
        const messagePayload = {
            time: currentTime,
            message: item,
            username: username
        };

        // Update the local message list
        setMessageList((prevMessages) => {
            const updatedMessages = [...prevMessages, messagePayload];

            // Scroll after messages have been updated
            setTimeout(() => {
                const objDiv = document.getElementById("chat_and_participants_body_msg_wrapper");
                if (objDiv && objDiv.scrollHeight) {
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }, 0);

            return updatedMessages;
        });

        // Emit the message to the server if room_id exists
        if (room_id) {
            socket.emit('send_message', {
                room_id: room_id,
                message: item,
                username: username,
                accessToken: accessToken
            }, (response) => {
                // Handle response if needed
            });
        }
    };

    const muteAllVideo = () => {
        socket.emit('mute_all_video', {
            room_id: room_id,
            username: username,
            socket_id: user.peer_id,
            isOwner: isOwner,
            isHost: isHost
        })
        setActivePopupIndex(null)
    }

    const muteAllMic = () => {
        socket.emit('mute_all_audio', {
            room_id: room_id,
            username: username,
            socket_id: user.peer_id,
            isOwner: isOwner,
            isHost: isHost
        })
        setActivePopupIndex(null)
    }

    const muteUserMic = (user) => {
        socket.emit('mute_target_audio', {
            room_id: room_id,
            username: username,
            socket_id: user.peer_id,
        })
        setActivePopupIndex(null)
    }

    const muteUserVideo = (user) => {
        socket.emit('mute_target_video', {
            room_id: room_id,
            username: username,
            socket_id: user.peer_id,
        })
        setActivePopupIndex(null)
    }

    const endMeetingForAll = () => {
        socket.emit('end_meeting_for_all', {
            room_id: room_id,
            username: username
        }, (response) => {
            handleLeaveRoom()
        });
    }

    const kickUser = (user) => {
        socket.emit('kick_user', {
            room_id: room_id,
            peer_id: user.peer_id
        }, (response) => {
            setActivePopupIndex(null)
        });
    }

    const promoteToHost = (user) => {
        socket.emit('promote_to_host', {
            room_id: room_id,
            peer_id: user.peer_id
        }, (response) => {
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === response.peer_id
                        ? { ...peer, is_host: true }
                        : peer
                );

                return newPeers;
            });

            // Set notification with the username who left
            setInMeetingNotification(`${user?.username || 'A participant'} is now a host`);

            setActivePopupIndex(null)

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });
    }

    const demoteToViewer = (user) => {
        socket.emit('demote_to_viewer', {
            room_id: room_id,
            peer_id: user.peer_id
        }, (response) => {
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === response.peer_id
                        ? { ...peer, is_host: false }
                        : peer
                );

                return newPeers;
            });

            // Set notification with the username who left
            setInMeetingNotification(`${user?.username || 'A participant'} has been removed as host`);

            setActivePopupIndex(null)

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });
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

    const handleHandRaise = () => {
        if (handRaise) {
            setHandRaise(false)

            const updatedHandRaises = handRaiseList.filter(h => h.socket_id !== socket.id);

            setHandRaiseList(updatedHandRaises);

            socket.emit('lower_hand_raise', {
                room_id: room_id,
                username: username,
                accessToken: accessToken,
            }, (response) => {

            });
        }
        else {
            setHandRaise(true)

            // Instead of mutating the existing array, create a new one
            const updatedHandRaises = [
                ...handRaiseList,
                {
                    username: username,
                    socket_id: socket.id
                }
            ];

            setHandRaiseList(updatedHandRaises);

            socket.emit('hand_raise', {
                room_id: room_id,
                username: username,
                accessToken: accessToken,
            }, (response) => {

            });
        }
    }

    // Get local media stream
    const getMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: !isVideoMuted,
                audio: !isAudioMuted
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

        socket.on('received_all_audio_mute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer => {
                    return (
                        { ...peer, audioMuted: true }
                    )
                })

                return newPeers;
            });
            audioMute()
        });

        socket.on('received_all_video_mute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer => {
                    return (
                        { ...peer, videoMuted: true }
                    )
                })

                return newPeers;
            });
            videoMute()
        });

        socket.on('received_video_mute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, videoMuted: true }
                        : peer
                );

                return newPeers;
            });
        });

        socket.on('received_video_unmute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, videoMuted: false }
                        : peer
                );

                return newPeers;
            });
        });

        socket.on('received_audio_unmute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, audioMuted: false }
                        : peer
                );

                return newPeers;
            });
        });

        socket.on('received_audio_mute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, audioMuted: true }
                        : peer
                );

                return newPeers;
            });
        });

        socket.on('received_target_video_mute', (data) => {
            // setPeers((prevPeers) => {
            //     const newPeers = prevPeers.map(peer =>
            //         peer.peer_id === data.peer_id
            //             ? { ...peer, videoMuted: true }
            //             : peer
            //     );

            //     return newPeers;
            // });

            if (data.peer_id === socket.id && !isVideoMuted) {
                videoMute()
            }
        });

        socket.on('received_target_audio_mute', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, audioMuted: true }
                        : peer
                );

                return newPeers;
            });

            if (data.peer_id === socket.id) {
                const audioTracks = localStream.getAudioTracks();
                setIsAudioMuted(true)

                audioTracks.forEach(track => {
                    track.stop();
                });

                audioTracks.forEach(track => {
                    localStream.removeTrack(track);
                });

                updatePeerTracks(true, isVideoMuted)
            }
        });

        socket.on('new_host_received', (data) => {
            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, is_host: true }
                        : peer
                );

                return newPeers;
            });

            if (data.peer_id === socket.id) {
                setIsHost(true)
            }

            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Set notification with the username who joined
            setInMeetingNotification(`${data?.username || 'A participant'} has been promoted to host`);

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });

        socket.on('host_remove_received', (data) => {

            setPeers((prevPeers) => {
                const newPeers = prevPeers.map(peer =>
                    peer.peer_id === data.peer_id
                        ? { ...peer, is_host: false }
                        : peer
                );

                return newPeers;
            });

            if (data.peer_id === socket.id) {
                setIsHost(false)
            }

            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Set notification with the username who joined
            setInMeetingNotification(`${data?.username || 'A participant'} has been removed as host`);

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });

        socket.on('receive_message', (data) => {
            const timeFormatter = new Intl.DateTimeFormat('en-PK', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Karachi'
            });
            const currentTime = timeFormatter.format(new Date());

            // Create the payload
            const messagePayload = {
                time: currentTime,
                message: data.message,
                username: data.username
            };

            // Update the local message list
            setMessageList((prevMessages) => [...prevMessages, messagePayload]);
        });

        socket.on('receive_hand_raise', (data) => {

            const payload = {
                username: data.username,
                socket_id: data.socket_id,
            };

            // Use Set to ensure unique socket_ids, but preserve existing entries
            const uniqueHandRaises = Array.from(
                new Set([
                    ...handRaiseList.map(item => item.socket_id),
                    payload.socket_id
                ])
            ).map(socket_id =>
                handRaiseList.find(item => item.socket_id === socket_id) || payload
            );

            setHandRaiseList(prevList => {
                // Check if the new socket_id is already in the list
                const isNewEntry = !prevList.some(item => item.socket_id === payload.socket_id);

                // If it's a new entry, append it
                if (isNewEntry) {
                    return [...prevList, payload];
                }

                // If it's already in the list, return the previous list
                return prevList;
            });
        });

        socket.on('receive_lower_hand_raise', (data) => {
            setHandRaiseList(prevList => {
                const updatedHandRaises = prevList.filter(h => h.socket_id !== data.socket_id);

                return updatedHandRaises;
            });
        });

        socket.on('user_joined_signal', (data) => {
            const peer = addPeer(data.signal, data.new_user_socket_id, localStream)
            setPeers(users => [...users, {
                is_owner: data.is_owner,
                peer_id: data.new_user_socket_id,
                username: data.username,
                is_host: data.is_host,
                videoMuted: data.videoMuted,
                audioMuted: data.audioMuted,
                peer
            }]);

            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Set notification with the username who joined
            setInMeetingNotification(`${data?.username || 'A participant'} has joined the room`);

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });

        socket.on('user_joined', (data) => {

        });

        socket.on('receiving_returned_signal', (data) => {
            const item = peers.find(p => p.peer_id === data.socket_id)
            item.peer.signal(data.signal)
        });

        socket.on('kick_user_received', (data) => {
            if (data.peer_id === socket.id) {
                alert('You have been removed from the meeting')
                handleLeaveRoom()
            }
            else {
                setPeers(currentPeers => {
                    const updatedPeers = currentPeers.filter(p => p.peer_id !== data.peer_id);

                    // Destroy the specific peer connection
                    const removedPeer = currentPeers.find(p => p.peer_id === data.peer_id);
                    if (removedPeer && removedPeer.peer) {
                        try {
                            removedPeer.peer.destroy();
                        } catch (error) {
                            console.error('Error destroying peer:', error);
                        }
                    }

                    return updatedPeers;
                });

                if (notificationTimeoutRef.current) {
                    clearTimeout(notificationTimeoutRef.current);
                }

                // Set notification with the username who left
                setInMeetingNotification(`${data?.username || 'A participant'} has been removed from the room`);

                // Set a new timeout to clear the notification
                notificationTimeoutRef.current = setTimeout(() => {
                    setInMeetingNotification('');
                    // Clear the ref after timeout
                    notificationTimeoutRef.current = null;
                }, 3000);
            }
        });

        socket.on('meeting_end_received', (data) => {
            handleLeaveRoom()
            alert('Meeting has ended')
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

            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Set notification with the username who left
            setInMeetingNotification(`${data?.username || 'A participant'} has left the room`);

            // Set a new timeout to clear the notification
            notificationTimeoutRef.current = setTimeout(() => {
                setInMeetingNotification('');
                // Clear the ref after timeout
                notificationTimeoutRef.current = null;
            }, 3000);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('receive_message');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('user_joined_signal');
            socket.off('receiving_returned_signal');

            setIsHost(false);
            setIsOwner(false);
            setActivePopupIndex(null);
            setMessageList([])
            setInMeetingNotification('')
            setLocalStream(null);
            setScreenShare(false);
            setScreenRecording(false);
            setHandRaise(false);
            setPeers(null)
            setHasJoined(false);

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

            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Stop local stream tracks
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }

            if (isFirstRender.current) {
                isFirstRender.current = false;
            }
            else {
                handleLeaveRoom();
            }
        };
    }, [location.search]);


    const toggleHandRaise = () => {
        setHandRaise(!handRaise)
    };

    const toggleScreenRecording = () => {
        setScreenRecording(!screenRecording)
    };

    const audioMute = async () => {
        const audioTracks = localStream.getAudioTracks();

        // Update UI to show audio is muted
        setIsAudioMuted(true);
        updatePeerTracks(true, isVideoMuted);

        socket.emit('mute_audio', {
            room_id: room_id,
            username: username,
            socket_id: socket.id,
        })

        // Stop all existing audio tracks
        audioTracks.forEach(track => {
            track.stop(); // This is crucial - it actually turns off the microphone
        });

        // Clear the local stream's audio tracks
        audioTracks.forEach(track => {
            localStream.removeTrack(track);
        });
    }

    const videoMute = async () => {
        const videoTracks = localStream.getVideoTracks();

        // Update UI to show video is muted
        setIsVideoMuted(true);
        updatePeerTracks(isAudioMuted, true);

        socket.emit('mute_video', {
            room_id: room_id,
            username: username,
            socket_id: socket.id,
        })

        // Stop all existing video tracks
        videoTracks.forEach(track => {
            track.stop(); // This is crucial - it actually turns off the camera
        });

        // Clear the local stream's video tracks
        videoTracks.forEach(track => {
            localStream.removeTrack(track);
        });

        // Clear the video source
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
    }

    // Toggle video mute
    const toggleVideoMute = async () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();

            if (videoTracks.length > 0) {
                videoMute()
            } else {
                // If no tracks, try to re-enable video
                try {
                    // Enable the new track and update state
                    setIsVideoMuted(false);
                    updatePeerTracks(isAudioMuted, false);

                    socket.emit('unmute_video', {
                        room_id: room_id,
                        username: username,
                        socket_id: socket.id,
                    })

                    const newStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });

                    const newVideoTrack = newStream.getVideoTracks()[0];

                    // Add the new track to the existing stream
                    localStream.addTrack(newVideoTrack);

                    // Update video source
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStream;
                    }
                } catch (error) {
                    console.error('Error re-enabling video:', error);
                    alert('Could not re-enable video. Check camera permissions.');
                }
            }
        }
    };


    // Toggle audio mute
    const toggleAudioMute = async () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();

            if (audioTracks.length > 0) {
                audioMute()
            } else {
                // If no tracks, try to re-enable audio
                try {
                    // Enable the new track and update state
                    setIsAudioMuted(false);

                    updatePeerTracks(false, isVideoMuted);

                    socket.emit('unmute_audio', {
                        room_id: room_id,
                        username: username,
                        socket_id: socket.id,
                    })

                    const newStream = await navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: true
                    });

                    const newAudioTrack = newStream.getAudioTracks()[0];

                    // Add the new track to the existing stream
                    localStream.addTrack(newAudioTrack);
                } catch (error) {
                    console.error('Error re-enabling audio:', error);
                    alert('Could not re-enable audio. Check microphone permissions.');
                }
            }
        }
    };

    const updatePeerTracks = (newAudioState, newVideoState) => {
        if (localStream) {
            localStream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = !newVideoState;
                }
                if (track.kind === 'audio') {
                    track.enabled = !newAudioState;
                }
            });

            // Update tracks for all peers
            peers.forEach(({ peer }) => {
                if (peer && peer.streams && peer.streams[0]) {

                    peer.streams[0].getTracks().forEach(track => {
                        if (track.kind === 'video') {
                            track.enabled = !newVideoState;
                        }
                        if (track.kind === 'audio') {
                            track.enabled = !newAudioState;
                        }
                    });
                }
            });
        }
    };

    function addPeer(incomingSignal, new_user_socket_id, stream) {
        if (stream) {
            stream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = !isVideoMuted;
                }
                if (track.kind === 'audio') {
                    track.enabled = !isAudioMuted;
                }
            });
        }

        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            },
            offerOptions: {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            },
            stream
        });

        peer.on('signal', signal => {
            socket.emit('returning_signal', {
                new_user_socket_id: new_user_socket_id,
                signal: signal,
                videoMuted: isVideoMuted,
                audioMuted: isAudioMuted
            });
        });

        peer.on('error', (err) => {
            console.error('Peer connection error:', err);
            setPeers(currentPeers =>
                currentPeers.filter(p => p.peer_id !== new_user_socket_id)
            );
        });

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div>
            {room_id && (
                <>

                    {/* {
                        peers && */}
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
                        messageList={messageList}
                        setMessageList={setMessageList}
                        userMessage={userMessage}
                        setUserMessage={setUserMessage}
                        setScreenShare={setScreenShare}
                        screenShare={screenShare}
                        toggleScreenRecording={toggleScreenRecording}
                        setScreenRecording={setScreenRecording}
                        screenRecording={screenRecording}
                        handRaise={handRaise}
                        setHandRaise={setHandRaise}
                        toggleHandRaise={toggleHandRaise}
                        inMeetingNotification={inMeetingNotification}
                        setInMeetingNotification={setInMeetingNotification}
                        handRaiseList={handRaiseList}
                        setHandRaiseList={setHandRaiseList}
                        handleHandRaise={handleHandRaise}
                        setIsHost={setIsHost}
                        isHost={isHost}
                        muteUserMic={muteUserMic}
                        muteUserVideo={muteUserVideo}
                        kickUser={kickUser}
                        promoteToHost={promoteToHost}
                        demoteToViewer={demoteToViewer}
                        activePopupIndex={activePopupIndex}
                        setActivePopupIndex={setActivePopupIndex}
                        isOwner={isOwner}
                        setIsOwner={setIsOwner}
                        endMeetingForAll={endMeetingForAll}
                        muteAllVideo={muteAllVideo}
                        muteAllMic={muteAllMic}
                    />
                    {/* } */}



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
                    </div > */}

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