import React, { useState } from "react";
import Draggable from "react-draggable";
import { ClipLoader } from "react-spinners";

interface TwitchEmbedProps {
    channel: string;
}

const TwitchEmbed: React.FC<TwitchEmbedProps> = ({ channel }) => {
    const [loading, setLoading] = useState(true);
    const parentDomain = window.location.hostname;

    const handleIframeLoad = () => {
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center p-10 h-full w-full bg-red-600">
            <Draggable handle=".handle" bounds="parent">
                <div className="handle w-full h-full">

                    {loading && (
                        <div className="flex justify-center items-center h-full w-full">
                            <ClipLoader color="#9146FF" loading={loading} size={50} />
                        </div>
                    )}

                    <iframe
                        src={`https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true&muted=false&controls=true`}
                        allowFullScreen
                        width="100%"
                        height="50%"
                        style={{ width: "100%", height: "50%", display: loading ? 'none' : 'block' }}
                        onLoad={handleIframeLoad}
                    ></iframe>
                    <iframe
                        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parentDomain}`}
                        width="100%"
                        height="100vh"
                        style={{ width: "100%", height: "100%" }}
                    ></iframe>
                </div>
            </Draggable>
        </div>
    );
};

export default TwitchEmbed;
