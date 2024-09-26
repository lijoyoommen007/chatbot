import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client'; // React 18's method
import './ChatBot.css'; // Ensure your CSS file is correctly referenced
import ChatBotCard from './ChatBotCard'; // Import the ChatBotCard component
import ChatBotMainSection from './ChatBotMainCard'; // Import the ChatBotMainSection component
import chatIcon from './Animation - 1727288257547.gif'; // Ensure this path is correct

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false); // Tracks chat bot opening after 1 second
    const [toggleCardOpen, setToggleCardOpen] = useState(false); // Tracks the main section toggle

    // Opens the chat bot automatically after 1 second
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

    // Toggles between the chat icon and chat bot card
    const toggleClick = () => {
        setToggleCardOpen(!toggleCardOpen);
    };

    return (
        <div className="chat-bot-container">
            {/* Chat Icon */}
            <div className="chat-icon">
                <img 
                    src={chatIcon} 
                    alt="Chat Icon" 
                    className="chat-icon-gif" 
                    onClick={toggleClick} 
                />
            </div>

            {/* Chat Bot Card */}
            {isOpen && !toggleCardOpen && (
                <ChatBotCard closeChat={() => setIsOpen(false)} />
            )}

            {/* Chat Bot Main Section */}
            {toggleCardOpen && (
                <ChatBotMainSection closeChat={() => setToggleCardOpen(false)} />
            )}
        </div>
    );
};

export default ChatBot;

// Automatically load ChatBot into the DOM
(function() {
    // Ensure the DOM is ready before trying to manipulate it
    window.addEventListener('DOMContentLoaded', function() {
        // Check if the chat-bot-container exists, if not, create it
        let chatBotContainer = document.querySelector('.chat-bot-container');
        if (!chatBotContainer) {
            chatBotContainer = document.createElement('div');
            chatBotContainer.classList.add('chat-bot-container');
            document.body.appendChild(chatBotContainer); // Append it to the body
        }

        // Use React 18's createRoot instead of ReactDOM.render
        const root = createRoot(chatBotContainer);
        root.render(<ChatBot />);
    });
})();
