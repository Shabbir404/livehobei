const express = require('express');
const app = express();
const server = app.listen(3000);
app.use(express.static('public'));
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('User connected');
});
let users = [];

io.on('connection', (socket) => {
    users.push(socket);

    if (users.length >= 2) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const [user1, user2] = [users[0], users[randomIndex]];
        users = users.filter((user) => user !== user1 && user !== user2);

        // Emit an event to start the chat
        user1.emit('start-chat', { with: user2.id });
        user2.emit('start-chat', { with: user1.id });
    }
});
io.on('connection', (socket) => {
    // ...

    socket.on('send-message', (data) => {
        socket.to(data.to).emit('message-received', {
            message: data.message,
            from: socket.id
        });
    });
});
