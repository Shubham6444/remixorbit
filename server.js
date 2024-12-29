// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve a simple homepage for testing
app.get('/', (req, res) => {
    res.send('<h1>Socket.IO Server is Running</h1>');
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for messages from the client
    socket.on('message', (data) => {
        console.log('Received from client:', data);
        // Broadcast the message to other clients
        socket.broadcast.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Use dynamic port or fallback to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
