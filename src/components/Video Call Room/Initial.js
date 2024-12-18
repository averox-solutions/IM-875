import React, { useState, useEffect, useContext, useRef } from 'react';
import AppContext from '../AppContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { HiVideoCamera } from "react-icons/hi2";
import { HiVideoCameraSlash } from "react-icons/hi2";
import Peer from 'simple-peer';


function Initial(props) {
    let { user, accessToken } = useContext(AppContext);
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
        setIsHost,
        isHost,
        isOwner,
        setIsOwner,
    } = props;

    const [joiningRoom, setJoiningRoom] = useState(false)

    // Get user media on component mount
    useEffect(() => {
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
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getMediaStream();

        // Cleanup function to stop tracks when component unmounts
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


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

    // // Toggle video mute
    // const toggleVideoMute = async () => {
    //     if (localStream) {
    //         const videoTracks = localStream.getVideoTracks();

    //         if (videoTracks.length > 0) {
    //             // Update UI to show video is muted
    //             setIsVideoMuted(true);

    //             // Stop all existing video tracks
    //             videoTracks.forEach(track => {
    //                 track.stop(); // This is crucial - it actually turns off the camera
    //             });

    //             // Clear the local stream's video tracks
    //             videoTracks.forEach(track => {
    //                 localStream.removeTrack(track);
    //             });

    //             // Clear the video source
    //             if (localVideoRef.current) {
    //                 localVideoRef.current.srcObject = null;
    //             }
    //         } else {
    //             // If no tracks, try to re-enable video
    //             try {
    //                 // Enable the new track and update state
    //                 setIsVideoMuted(false);

    //                 const newStream = await navigator.mediaDevices.getUserMedia({
    //                     video: true,
    //                     audio: false
    //                 });

    //                 const newVideoTrack = newStream.getVideoTracks()[0];

    //                 // Add the new track to the existing stream
    //                 localStream.addTrack(newVideoTrack);

    //                 // Update video source
    //                 if (localVideoRef.current) {
    //                     localVideoRef.current.srcObject = localStream;
    //                 }
    //             } catch (error) {
    //                 console.error('Error re-enabling video:', error);
    //                 alert('Could not re-enable video. Check camera permissions.');
    //             }
    //         }
    //     }
    // };

    // // Toggle audio mute
    // const toggleAudioMute = async () => {
    //     if (localStream) {
    //         const audioTracks = localStream.getAudioTracks();

    //         if (audioTracks.length > 0) {
    //             // Update UI to show audio is muted
    //             setIsAudioMuted(true);

    //             // Stop all existing audio tracks
    //             audioTracks.forEach(track => {
    //                 track.stop(); // This is crucial - it actually turns off the microphone
    //             });

    //             // Clear the local stream's audio tracks
    //             audioTracks.forEach(track => {
    //                 localStream.removeTrack(track);
    //             });
    //         } else {
    //             // If no tracks, try to re-enable audio
    //             try {
    //                 // Enable the new track and update state
    //                 setIsAudioMuted(false);

    //                 const newStream = await navigator.mediaDevices.getUserMedia({
    //                     video: false,
    //                     audio: true
    //                 });

    //                 const newAudioTrack = newStream.getAudioTracks()[0];

    //                 // Add the new track to the existing stream
    //                 localStream.addTrack(newAudioTrack);
    //             } catch (error) {
    //                 console.error('Error re-enabling audio:', error);
    //                 alert('Could not re-enable audio. Check microphone permissions.');
    //             }
    //         }
    //     }
    // };

    const joinRoom = async (e) => {
        e.preventDefault()

        if (room_id && !joiningRoom) {
            setJoiningRoom(true)
            console.log('called 1')
            socket.emit('join_room', {
                room_id: room_id,
                username: e.target.user_message.value.trim(),
                accessToken: accessToken,
                videoMuted: isVideoMuted,
                audioMuted: isAudioMuted,
            }, (response) => {
                setIsHost(response.is_host)
                setIsOwner(response.is_owner)
                const allPeers = []

                response.existingUsers.forEach((data, index) => {
                    const peer = createPeer(data.socket_id, response.socket_id, localStream, response.is_host, response.is_owner);
                    allPeers.push({
                        peer_id: data.socket_id,
                        username: data.username,
                        peer,
                        is_host: data.is_host,
                        audioMuted: data.audioMuted,
                        videoMuted: data.videoMuted,
                        is_owner: data.is_owner,
                    })
                })

                setPeers(allPeers);

                setHasJoined(true)
                console.log('You have joined the room');

                setJoiningRoom(false)
            });
        }
    }


    function createPeer(socket_id, new_user_socket_id, stream, is_host, is_owner) {
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
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            },
            stream
        });

        peer.on('signal', signal => {
            socket.emit('sending_signal', {
                username: username,
                socket_id: socket_id,
                is_host: is_host,
                is_owner: is_owner,
                new_user_socket_id: new_user_socket_id,
                signal: signal,
                videoMuted: isVideoMuted,
                audioMuted: isAudioMuted
            });
        });

        return peer;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
        }}>
            {/* Video Container */}
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
                {(isVideoMuted || !localStream) && (
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

            {/* Media Controls */}
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
            </div>

            {/* Join Room Form */}
            <form
                onSubmit={joinRoom}
                style={{
                    width: '200px',
                    marginTop: '10px'
                }}
            >
                <input
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                    required
                    name='user_message'
                    placeholder='Your Name'
                    type='text'
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px'
                    }}
                />
                <button
                    type='submit'
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        borderRadius: '4px',
                        border: 'none'
                    }}
                >
                    {joiningRoom ? "Joining" : "Join"}
                </button>
            </form>
        </div>
    );
}

export default Initial;