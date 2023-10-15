const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));
const usernames = new Map();

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('user login', (username) => {
        if (usernames.has(username)) {
            socket.emit('username-taken');
        } else {
            if (username.length >= 30 || typeof username != 'string') {
                socket.emit('warning')
            } else {
                socket.username = username;
                usernames.set(username, socket.id);
                socket.emit('login-success');
            }
        }
    });

    socket.on('join room', (roomId) => {
        socket.join(roomId); 
        io.to(roomId).emit('code-room', {code : roomId})
        io.to(roomId).emit('room-message', {usernames: socket.username, message: 'has join the chat'});
    });

    socket.on('chat message', (data) => {
        io.to(data.roomId).emit('room-message', {usernames: socket.username, message: data.message });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            console.log(`${socket.username} disconnected`);
            usernames.clear()
            io.emit('room-message', { message: `${socket.username} has left the chat.` });
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
