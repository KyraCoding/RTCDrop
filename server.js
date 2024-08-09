const express = require('express')
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/pages/home.html")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})