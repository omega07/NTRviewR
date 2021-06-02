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
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.send('on /')
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors());

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

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});