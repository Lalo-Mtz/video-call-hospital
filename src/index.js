// Modules
const express = require('express');
const path = require('path');
const { Server } = require('http');
const { ExpressPeerServer } = require('peer');

// Initializations
const app = express();
const server = Server(app);
const io = require('socket.io')(server);
const peerServer = ExpressPeerServer(server, {
    debug: true
});


// Seetings
app.use('/peerjs', peerServer);
app.set('port', process.env.PORT || 3500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares

// Routes
app.use(require('./routes'));


// Socket.io
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) =>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
    })
});


// Start server
server.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
})

