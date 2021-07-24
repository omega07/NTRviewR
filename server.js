const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const url = "https://api.jdoodle.com/v1/execute";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const server = require('http').createServer(app);
const {addUser, getUsers, deleteUser} = require('./src/utils/users.js');
const Document = require('./src/utils/document.js');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const DB_URL = `mongodb+srv://ayushshah:${process.env.DB_PASS}@cluster0.qugft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors());
let codeMap = new Map();
let textMap = new Map();
let userArray = [];

const updateUsers = (roomID) => {
    const users = [];
    userArray.forEach(user => {
        if(roomID===user.roomID) {
            users.push({
                userID: user.userID,
                typing: false,
                name: user.username
            })
        }
    });
    return users.filter(user => user.userID);
}

const updateUserTyping = (recUser, roomID) => {
    const users = [];
    userArray.forEach(user => {
        if(roomID===user.roomID) {
            users.push({
                userID: user.userID,
                typing: (user === recUser?true:false),
                name: user.username
            })
        }
    });
    return users.filter(user => user.userID);
}

let editor_code = "#include <bits/stdc++.h>"+"\n"+"using namespace std;"+"\n"+"int main() {"+"\n"+"\tcout<<\"Hello, World!\";"+"\n"+"}";
let defaultCode = editor_code;
let userMessages = [];

const userMessagesofRoom = (roomID) => {
    const msgs = [];
    userMessages.forEach(msg => {
        if(msg.roomID===roomID) msgs.push(msg);
    });
    return msgs;
}

io.on('connection', socket => {
    socket.on('join-room', ({user, roomID, name}) => {
        socket.join(roomID);
        socket.user = user;
        userArray = addUser(socket.id, user, name, roomID);
        if(codeMap.get(roomID)===defaultCode) {
            codeMap.set(roomID,editor_code);    
        }
        if(textMap.get(roomID)==="") {
            textMap.set(roomID, "");
        }
        socket.emit('code-change',codeMap.get(roomID));
        socket.emit('recieve-changes',textMap.get(roomID));
        const newUser = updateUsers(roomID);
        io.to(roomID).emit('users', newUser);
        socket.on('code-change', ({code,user}) => {
            if(code.length) {
                codeMap.set(roomID,code);
                userArray = getUsers();
                socket.to(roomID).emit('user-typing', updateUserTyping(user, roomID));
                socket.to(roomID).emit('code-change',codeMap.get(roomID));
            } else {
                socket.emit('code-change', codeMap.get(roomID));
            }
        })
        socket.on('theme-change', theme => {
            socket.to(roomID).emit('theme-change', theme);
        })
        socket.on('snippet-change', data => {
            socket.to(roomID).emit('snippet-change', data);
        })
        socket.on('message', data => {
            if(data.message.length) {
                userMessages.push({...data, roomID});
            }
            io.to(roomID).emit('new-message', userMessagesofRoom(roomID));
        })
        socket.on('send-changes', ({data, tp, contents}) => {
            if(tp) {
                socket.emit('recieve-changes', textMap.get(roomID));
            } else {
                textMap.set(roomID, contents);
                socket.to(roomID).emit('recieve-changes', data);
            }
        })
        socket.on('disconnect', reason => {
            const userDisconnected = deleteUser(socket.id);
            userArray = getUsers();
            io.to(roomID).emit('users',updateUsers(roomID));
        })
    });
});

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});


app.get('/room/:id',(req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
})

app.post('/report', (req, res) => {
    Document.create({email: req.body.email, bug: req.body.bug})
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.send(err);
            })
})


app.post('/', (req,res) => {
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


