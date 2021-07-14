import React, { useState, useRef } from 'react';
import '../styles/Home.css';
import {Button} from '@material-ui/core';
import 'boxicons'

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [roomIDError, setRoomIDError] = useState('')
    const username = useRef('');
    const room_ID = useRef('');
    const handleCreateRoom = e => {
        if(username.current.value.length === 0) setUsernameError(<p className="home__usernameError"><box-icon size="xs" name="error"></box-icon>Enter a username!</p>)
        console.log(username.current.value.length, e);
    }
    const handleJoinRoom = e => {
        if(username.current.value.length === 0) setUsernameError(<p className="home__usernameError"><box-icon size="xs" name="error"></box-icon>Enter a username!</p>)
        if(room_ID.current.value.length === 0) setRoomIDError(<p className="home__roomIDError"><box-icon size="xs" name="error"></box-icon>Enter a room ID to join a room!</p>)
    }
    return (
        <div className="homex">
            <div className="home">
                <div className="home__usernameinput">
                    <input ref={username} className="usernameinput" placeholder="Enter a username"/>
                    {usernameError}
                </div>
                <Button variant="contained" color="secondary" onClick={handleCreateRoom}>Create Room</Button>
                <div className="home__joinroom">
                    <div className="roominput">
                        <input ref={room_ID} className="home__roominput" type="text" placeholder="Enter Room ID"/>
                        {roomIDError}
                    </div>
                    <Button className="btn__joinroom" variant="contained" color="secondary" onClick={handleJoinRoom}>Join Room</Button>
                </div>
            </div>
        </div>
    )
}

export default Home
