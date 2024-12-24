import React, { useState, useRef } from "react";

const Recording = () => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "window",
                },
                audio: true,
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm; codecs=vp9",
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: "video/mp4",
                });

                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.mp4";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                recordedChunksRef.current = [];
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
            }}
        >
            <h1>Screen Recording</h1>
            <button
                style={{
                    border: "none",
                    background: "none",
                    outline: "none",
                    transition: "transform 0.3s ease, background-color 0.3s ease",
                    cursor: "pointer",
                }}
                onClick={recording ? stopRecording : startRecording}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
                <svg
                    viewBox="0 0 72 72"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    style={{
                        width: "30px",
                        height: "30px",
                        background: "#ff0e03",
                        borderRadius: "50px",
                        transition: "background-color 0.3s ease, transform 0.3s ease",
                    }}
                >
                    <g id="SVGRepo_iconCarrier">
                        <g id="line">
                            <circle
                                cx="36"
                                cy="36"
                                r="20"
                                fill="none"
                                stroke="#000000"
                                strokeLineJoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                            ></circle>
                            <circle
                                cx="36"
                                cy="36"
                                r="7"
                                fill="#000000"
                                stroke="none"
                            ></circle>
                        </g>
                        <g id="color-foreground">
                            <circle
                                cx="36"
                                cy="36"
                                r="7"
                                fill={recording ? "#000" : "#000000"}
                                stroke="none"
                            ></circle>
                        </g>
                    </g>
                </svg>
            </button>
        </div>
    );
};

export default Recording;
