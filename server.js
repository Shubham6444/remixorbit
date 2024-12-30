
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));
app.use(express.json());

let users = []; // Store users' socket IDs and names

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a user logs in
    socket.on('login user', (user) => {
        if (user && user.loginuser) {
            // Add the new user to the users list
            users.push({ id: socket.id, name: user.loginuser });
            console.log(`User logged in: ${user.loginuser} (ID: ${socket.id})`);

            // Broadcast the updated user list to all clients
            io.emit('user id', {
                id: socket.id,
                users: users.map(user => ({ id: user.id, name: user.name }))
            });
        } else {
            console.error('Invalid login user data:', user);
        }
    });

    // When a user sends a message
    socket.on('chat message', (msg) => {
        if (msg && msg.msg && msg.sender && msg.id) {
            console.log('Message received:', msg);

            // Emit the message to the target user
            io.to(msg.id).emit('chat message', {
                rmsg: msg.msg,
                sender: msg.sender,
                id: socket.id,
            });
        } else {
            console.error('Invalid message format:', msg);
        }
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);

        // Remove the user from the users list
        users = users.filter(user => user.id !== socket.id);

        // Broadcast updated user list to all clients
        io.emit('user id', {
            id: socket.id,
            users: users.map(user => ({ id: user.id, name: user.name }))
        });
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
}); 

