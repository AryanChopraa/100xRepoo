const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
});

const users = {};

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('join', username => {
        users[socket.id] = username;
        io.emit('userJoined', username);
        io.emit('updateUserList', Object.values(users));
    });

    socket.on('message', message => {
        io.emit('message', { user: users[socket.id], message });
    });

    socket.on('disconnect', () => {
        const disconnectedUser = users[socket.id];
        delete users[socket.id];
        io.emit('userLeft', disconnectedUser);
        io.emit('updateUserList', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
