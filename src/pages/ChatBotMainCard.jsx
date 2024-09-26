import React, { useState, useEffect, useRef } from "react";
import './ChatBotMainSection.css'; // Custom styles for chatbot section
import image from "./AgentConnect_BlogHeader-1024x576-131.jpg"; // Dummy image

const ChatBotMainSection = ({ closeChat }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isClosing, setIsClosing] = useState(false); // For smooth closing animation
    const chatBodyRef = useRef(null);

    // Smooth opening animation
    useEffect(() => {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.style.transform = "translateY(0)";
        chatContainer.style.opacity = 1;
    }, []);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle smooth close
    const handleCloseChat = () => {
        setIsClosing(true);
        setTimeout(() => {
            closeChat(); // Invoke the parent closeChat function after animation
        }, 500); // Match the transition duration
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (inputMessage.trim() === "") return;

        // User message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, sender: "user" }
        ]);

        setInputMessage("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "This is a dummy bot response.", sender: "bot" }
            ]);
        }, 1000);
    };

    return (
        <div
            id="chat-container"
            className={`chat-bot-main-section ${isClosing ? "close-animation" : ""}`}
        >
            {/* Chat Header */}
            <div className="chat-header">
                <img src={image} alt="Bot" className="bot-avatar" />
                <h4>Chat with Us</h4>
                <button className="close-btn" onClick={handleCloseChat}>✕</button>
            </div>

            {/* Chat Body */}
            <div className="chat-body" ref={chatBodyRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${message.sender === "user" ? "user-message" : "bot-message"}`}
                    >
                        {message.sender === "bot" && (
                            <img src={image} alt="Bot" className="message-avatar" />
                        )}
                        {message.sender === "user" && (
                            <div className="user-avatar">U</div> 
                        )}
                        <div className="message-text">
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input-section">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="send-btn" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBotMainSection;
