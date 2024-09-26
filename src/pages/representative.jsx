import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend Socket.io server
const socket = io('http://localhost:5000'); 

const RepresentativePanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Listen for messages from users
    socket.on('receive_message', (data) => {
      const { id, message, sender } = data;
      setMessages((prevMessages) => ({
        ...prevMessages,
        [id]: [...(prevMessages[id] || []), { message, sender }],
      }));

      // Add user to the list if not already present
      if (!users.some((user) => user.id === id)) {
        setUsers((prevUsers) => [...prevUsers, { id, name: `User ${id}` }]);
      }
    });

    return () => {
      // Cleanup on component unmount
      socket.off('receive_message');
    };
  }, [users]);

  const sendResponse = () => {
    if (selectedUser && response.trim()) {
      // Emit message to the backend for the selected user
      socket.emit('rep_message', { userId: selectedUser, message: response });

      // Update messages in the frontend
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser]: [...(prevMessages[selectedUser] || []), { message: response, sender: 'representative' }],
      }));
      setResponse('');
    }
  };

  console.log(users,response,messages)

  return (
    <div className="chat-app-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Side panel for user list */}
      <div className="user-list" style={{ width: '30%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h3>Users</h3>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedUser === user.id ? '#e0e0e0' : '#fff',
                borderBottom: '1px solid #ddd'
              }}
            >
              {user.name}
            </div>
          ))
        ) : (
          <div>No users online</div>
        )}
      </div>

      {/* Chat panel for selected user */}
      <div className="chat-box" style={{ width: '70%', padding: '20px' }}>
        {selectedUser ? (
          <>
            <div className="messages" style={{ height: '80%', overflowY: 'scroll', marginBottom: '20px' }}>
              {messages[selectedUser] ? (
                messages[selectedUser].map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      backgroundColor: msg.sender === 'representative' ? '#d1e7dd' : '#f8d7da',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      textAlign: msg.sender === 'representative' ? 'right' : 'left'
                    }}
                  >
                    {msg.message}
                  </div>
                ))
              ) : (
                <div>No messages yet</div>
              )}
            </div>
            <div className="input-area" style={{ display: 'flex' }}>
              <input
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response"
                style={{ flex: 1, padding: '10px' }}
              />
              <button onClick={sendResponse} style={{ padding: '10px 20px' }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div>Please select a user to chat with</div>
        )}
      </div>
    </div>
  );
};

export default RepresentativePanel;   
