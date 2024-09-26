import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './ChatBot.css'; // Include your styles
import ChatBotCard from './chatbotcard'; // Import the ChatBotCard component
import chatIcon from './Animation - 1727288257547.gif'; // Import your GIF here
import ChatBotMainSection from "./ChatBotMainCard";

 const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [toggleCardOpen, setToggleCardOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

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
                /> {/* Use the GIF here */}
            </div>

            {/* Chat Bot Card */}
            {isOpen && <ChatBotCard closeChat={() => setIsOpen(false)} />}

            {toggleCardOpen && <ChatBotMainSection closeChat={() => setToggleCardOpen(false)} />}
        </div>
    );
};

export default ChatBot

// Automatically load ChatBot into the DOM
(function() {
    // Ensure the DOM is ready before trying to manipulate it
    window.addEventListener('DOMContentLoaded', function() {
        // Check if the chat-bot-container exists, if not, create it
        let chatBotContainer = document.getElementById('chat-bot-container');
        if (!chatBotContainer) {
            chatBotContainer = document.createElement('div');
            chatBotContainer.id = 'chat-bot-container';
            document.body.appendChild(chatBotContainer); // Append it to the body
        }

        // Now render the ChatBot component into the container
        ReactDOM.render(<ChatBot />, chatBotContainer);
    });
})(); 
