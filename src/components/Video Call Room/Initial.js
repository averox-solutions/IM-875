import React, { useState, useEffect, useContext, useRef } from 'react';
import AppContext from '../AppContext';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { IoMicOutline } from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";
import { MdComputer } from "react-icons/md";
import { FiPhoneMissed } from "react-icons/fi";
import { IoIosMic } from "react-icons/io";
import { HiVideoCamera } from "react-icons/hi2";
import { HiVideoCameraSlash } from "react-icons/hi2";
import Peer from 'simple-peer';
import './Initial.css'
import BeepLogo from '../../assets/Beep.svg'
import { Link } from 'react-router-dom';


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
        screenStream,
        setScreenStream,
        screenPeers,
        setScreenPeers,
        screenPeerRef,
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

    const joinRoom = async (e) => {
        e.preventDefault()

        if (room_id && !joiningRoom) {
            setJoiningRoom(true)
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
            offerOptions: {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
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

    const [toggleStates, setToggleStates] = React.useState({
        computer_audio: false,
        phone_audio: false,
        room_audio: false,
        no_audio: false,
    });
    const [toggleAudioStates, setToggleAudioStates] = React.useState({
        computer_audio: false,
        phone_audio: false,
        room_audio: false,
        no_audio: false,
    });

    const handleToggle = (key) => {
        setToggleStates((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <>
            <div id='initial_vc_head'>
                <img src={BeepLogo} alt="Beep Logo" className="vc_head_logo" />
            </div>
            <div id='initial_vc_master'>
                <div id='initial_vc_child'>
                    <div id='initial_vc_video_master'>
                        <video
                            id='initial_vc_video_vid'
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
                        {isVideoMuted && <div id='initial_vc_video_media_opts_btns_overla_cam'>
                            Camera is switched off
                        </div>}
                        <div id='initial_vc_video_media_opts_btns_overlay'></div>
                        <div id='initial_vc_video_media_opts_btns_master'>
                            <button
                                className='initial_vc_video_media_opts_btns_bt'
                                onClick={toggleVideoMute}
                                style={{
                                    background: isVideoMuted ? 'var(--mute-btn)' : 'none',
                                    border: isVideoMuted ? '1px solid rgba(0,0,0,0)' : '1px solid white'
                                }}
                            >
                                {isVideoMuted ? <HiVideoCameraSlash className='initial_vc_video_media_opts_btns_b_icon' /> : <HiVideoCamera className='initial_vc_video_media_opts_btns_b_icon' />}
                            </button>
                            <button
                                className='initial_vc_video_media_opts_btns_bt'
                                onClick={toggleAudioMute}
                                style={{
                                    background: isAudioMuted ? 'var(--mute-btn)' : 'none',
                                    border: isAudioMuted ? '1px solid rgba(0,0,0,0)' : '1px solid white'
                                }}
                            >
                                {isAudioMuted ? <IoMdMicOff className='initial_vc_video_media_opts_btns_b_icon' /> : <IoMdMic className='initial_vc_video_media_opts_btns_b_icon' />}
                            </button>
                        </div>

                    </div>
                    <form onSubmit={joinRoom} id='initial_vc_video_form'>
                        <h1 id='initial_vc_video_fr_h1'>Join Meeting</h1>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            value={username}
                            required
                            name='user_message'
                            placeholder='Your Name'
                            type='text'
                            spellCheck={false}
                            className='initial_vc_for_inp'
                        />
                        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                            <Link
                                to='/vc'
                                className='initial_vc_link_cancel'
                            >
                                Cancel
                            </Link>
                            <button
                                style={joiningRoom ? { background: "var(--btn-primary-hover)", opacity: "0.5" } : {}}
                                type='submit'
                                className='initial_vc_link_join'
                            >
                                {joiningRoom ? "Joining" : "Join"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Initial;