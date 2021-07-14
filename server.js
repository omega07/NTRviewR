const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const url = "https://api.jdoodle.com/v1/execute";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const server = require('http').createServer(app);
require('dotenv').config();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

let editor_code = "";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors());

const updateUsers = () => {
    const users = [];
    for (let {user} of io.of("/").sockets.values()) {
        users.push({
            userID: user,
            typing: false
        });
    }
    return users;
}

const updateUserTyping = recUser => {
    const users = [];
    for (let {user} of io.of("/").sockets.values()) {
        users.push({
            userID: user,
            typing: (user === recUser?true:false)
        });
    }
    return users;
}

io.on('connection', socket => {
    socket.on('new-user', user => {
        socket.user = user;
        if(editor_code.length) {
            socket.emit('code-change',editor_code);
        }
        io.emit('users',updateUsers());
    })
    socket.on('code-change', ({code,user}) => {
        editor_code = code;
        socket.broadcast.emit('code-change',code);
        io.emit('user-typing', updateUserTyping(user));
    })
    socket.on('disconnect', reason => {
        io.emit('users',updateUsers());
    })
    socket.on('theme-change', theme => {
        socket.broadcast.emit('theme-change', theme);
    })
    socket.on('snippet-change', data => {
        socket.broadcast.emit('snippet-change', data);
    })
});

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.get('/editor',(req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.post('/', (req,res) => {
    console.log(req.body);
    const program = {
        "clientId" : clientId,
        "clientSecret" : clientSecret,
        "script" : req.body.code,
        "language" : req.body.lang,
        "versionIndex" : "0",
        "stdin" : req.body.input
    }
    axios.post(url,program)
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.send('error')
    })
});

server.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});


