// Trabalho baseado no video https://www.youtube.com/watch?v=jD7FnbI76Hg


const path = require('path');
const http = require('http');
const express = require('express');
const formatMessage = require('./utilities/messages');
const { userJoin, getCurrentUser, removeUser, getRoomUsers } = require('./utilities/users');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Set the static folder
app.use(express.static(path.join(__dirname, 'public')))

// Set Bot User Name
const bot = 'Admin';

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        // Create User
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Set User Welcome Msg
        socket.emit('message', formatMessage(bot, 'Bem-vindo ao Chat da TSIW'));

        // Broadcoast User Conected
        socket.broadcast.to(user.room).emit(
            'message', 
            formatMessage(bot, `${user.username} entrou na sala`
        ));
    
        // Set Room and Users info
        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        });

    });

    
    // On disconnect
    socket.on('disconnect', () => {

        // Get & Remove User
        const user = removeUser(socket.id);

        if (user) {

            // Set Leave Msg
            io.to(user.room).emit(
                'message', 
                formatMessage(bot, `${user.username} saiu da sala`)
            );

            // Set Room and Users info
            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUsers(user.room)
            });
        }

    });

    // Get Chat Message
    socket.on('chatMessage', msg => {
        // Get curent User
        const user = getCurrentUser(socket.id);
        // Set new message
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

});

// Set Port
const PORT = 3000 || process.env.PORT;

// Set server
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
