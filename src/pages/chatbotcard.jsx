import React, { useState, useEffect } from "react";
import './ChatBot.css'; // Include your styles
import image from "./AgentConnect_BlogHeader-1024x576-131.jpg"; // Dummy image

const ChatBotCard = ({ closeChat }) => {
    const [messageIndex, setMessageIndex] = useState(0); // State to track message

    useEffect(() => {
        let timer;
        if (messageIndex === 0) {
            // Show first message after 0.5s
            timer = setTimeout(() => {
                setMessageIndex(1);
            }, 500);
        } else if (messageIndex === 1) {
            // Show second message after 2s
            timer = setTimeout(() => {
                setMessageIndex(2);
            }, 2000);
        }

        return () => clearTimeout(timer); // Cleanup timer when effect re-runs or component unmounts
    }, [messageIndex]);

    return (
        <div className="chat-bot-card">
            {/* Chat representative image */}
            <div className="chat-representative">
                <img
                    src={image} // Dummy representative image
                    alt="Representative"
                    className="representative-image"
                />
            </div>

            {/* Chat messages */}
            <div className="chat-messages">
                {messageIndex === 1 && <p className="message">Hi there, how can I help you?</p>}
                {messageIndex === 2 && <p className="message">Want to know more? Feel free to ask!</p>}
            </div>

            {/* Close button */}
            <div className="close-button" onClick={closeChat}>
                &times; {/* X close icon */}
            </div>
        </div>
    );
};

export default ChatBotCard;
