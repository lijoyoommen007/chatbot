import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  Avatar,
  Drawer,
  ListItem,
  ListItemText,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import "../ChatApp.css"; // Import custom CSS for additional styling
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

const ChatApp = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [showHelpMessage, setShowHelpMessage] = useState(false); // State for showing the help message

  // Toggle chatbox visibility
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    setShowHelpMessage(false); // Hide message once chat is opened
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    // Send message to the server
    const handleSendMessage = () => {
        if (userMessage.trim() === "") return;
      
        // Send the message to the server
        socket.emit("user_message", { user: "You", message: userMessage });
      
        // Clear input after sending the message
        setUserMessage("");
      };
      
      // Listen for messages from the server
      useEffect(() => {
        socket.on("receive_message", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      
        // Cleanup when the component unmounts
        return () => {
          socket.off("receive_message");
        };
      }, [socket]);

  // Show help message after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelpMessage(true);
    }, 10000); // Show message after 10 seconds

    return () => clearTimeout(timer); // Clear the timer when component unmounts
  }, []);

  return (
    <Box>
      {/* Floating Chat and Sidebar Icon */}
      <Box position="fixed" bottom={16} right={16}>
        {/* Help Message */}
        {showHelpMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: 60, right: 16,width:200 }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "8px 12px",
                backgroundColor: "#0084ff",
                color: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography variant="body1">Hey there, how can I help you?</Typography>
            </Paper>
          </motion.div>
        )}

        {/* Chat Icon */}
        <IconButton
          onClick={toggleChat}
          sx={{
            backgroundColor: "#0084ff",
            color: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": { backgroundColor: "#007ae1", transform: "scale(1.1)" },
            transition: "all 0.3s ease",
          }}
          size="large"
        >
          <ChatIcon />
        </IconButton>
      </Box>

      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          backgroundColor: "#0084ff",
          color: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          "&:hover": { backgroundColor: "#007ae1", transform: "scale(1.1)" },
          transition: "all 0.3s ease",
        }}
        size="large"
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          sx: { width: 250, backgroundColor: "#f5f5f5", padding: 2 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Menu
        </Typography>
        <List>
          <ListItem button sx={{ "&:hover": { backgroundColor: "#ddd" } }}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button sx={{ "&:hover": { backgroundColor: "#ddd" } }}>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button sx={{ "&:hover": { backgroundColor: "#ddd" } }}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>

      {/* Chatbox */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Paper
            elevation={5}
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              width: 350,
              height: 600,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.4s ease",
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                backgroundColor: "#0084ff",
                color: "#fff",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "3px 3px 0 0",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Chatbot
              </Typography>
              <IconButton onClick={toggleChat} sx={{ color: "#fff" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Chat History */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 2,
                backgroundColor: "#f0f2f5",
              }}
            >
              {messages?.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      maxWidth: "80%",
                      alignItems: "flex-end",
                    }}
                  >
                    {message.sender !== "user" && (
                      <Avatar
                        sx={{
                          marginRight: 1,
                          backgroundColor: "#f50057",
                          color: "#fff",
                        }}
                      >
                        B
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        backgroundColor: message.sender === "user" ? "#0084ff" : "#e4e6eb",
                        color: message.sender === "user" ? "#fff" : "#000",
                        padding: "8px 12px",
                        borderRadius:
                          message.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        wordWrap: "break-word",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "400",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      >
                        {message.message}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Chat Input */}
            <Box
              sx={{
                padding: "12px 16px",
                backgroundColor: "#fff",
                borderTop: "1px solid #ddd",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  sx: {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                sx={{
                  marginTop: 1,
                  backgroundColor: "#0084ff",
                  color: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  "&:hover": { backgroundColor: "#007ae1" },
                  transition: "all 0.3s ease",
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default ChatApp;
