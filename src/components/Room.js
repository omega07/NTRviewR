import React, {useState, useRef, useEffect} from 'react';
import Editor from './Editor.js';
import TextEditor from './TextEditor.js';
import {Modal} from '@material-ui/core';
import Canvas from './Canvas.js';
import '../styles/Room.css';
import Chat from './Chat.js';
import LandingPage from './LandingPage.js';
import ActiveUsers from './ActiveUsers.js';
import {io} from 'socket.io-client';
import {useParams} from 'react-router-dom';
import local from '../utils/local.js'
import UUID from 'uuidjs';
const URL = (local?'http://localhost:8000':window.location.href);
const tempSocket = io(URL);

const Room = ({userID, username, setUserID, setUsername, activeUsers, setActiveUsers, socket}) => {

    const [tab, setTab] = useState(<LandingPage username={username} />);
    const [usernameModal, setUsernameModal] = useState(false);
    const input_username = useRef();
    const room_ID = useRef('');
    const {id} = useParams();

    useEffect(() => {
        if(!userID) {
            socket=tempSocket;
            const uuid = UUID.generate();
            setUserID(uuid);
            setUsernameModal(true);
        }
    }, [])

    const handleTabChange = e => {
        if(e.target.id === 'Chat') setTab(<Chat userID={userID} username={username} activeUsers={activeUsers} socket={socket} setActiveUsers={setActiveUsers}/>)
        else if(e.target.id === 'Editor') setTab(<Editor userID={userID} username={username} activeUsers={activeUsers} setActiveUsers={setActiveUsers} socket={socket}/>);
        else if(e.target.id === 'TextEditor') setTab(<TextEditor userID={userID} username={username} socket={socket}/>)
        else setTab(<Canvas userID={userID} username={username} socket={socket} />);
    }


    const handleUsernameChange = e => {
        setUsername(e.target.value);
    }

    const handleClose = () => {
        if(username.length === 0) {
            setUsernameModal(true);
        }
        else {
            setUsernameModal(false);
            setTab(<LandingPage username={username} />);
            socket.emit('join-room', {"user":userID, "roomID":id, "name": username});
        }
    }

    const body = (
        <>
            <div ref={input_username} className="modal_for_input">
                <input autoFocus={true} className="input_for_username" placeholder="Enter your username!" onChange={handleUsernameChange} type="text"/>
                <button className="input_username_btn" onClick={handleClose}>Ok!</button>
            </div>
        </>
    );

    (socket || tempSocket).on('users', users => {
        setActiveUsers(users);
    })

    return (
        <>
            <Modal open={usernameModal} onClose={handleClose}>
                {body}
            </Modal>
            <div className="room">
                <div className="room__inner">
                    <ul>
                        <li>
                            <input type="radio" id="Editor" name="which" value="Editor" />
                            <label onClick={handleTabChange} id="Editor" className="ev_c" for="Editor">{"</>"}Code</label>
                        </li>
                        <li>
                            <input type="radio" id="TextEditor" name="which" value="TextEditor"/>
                            <label onClick={handleTabChange} id="TextEditor" className="ev_c" for="TextEditor">📝Edit</label>
                        </li>
                        <li>
                            <input type="radio" id="Chat" name="which" value="Chat"/>
                            <label onClick={handleTabChange} id="Chat" className="ev_c" for="Chat">💬Chat</label>
                        </li>
                        <li>
                            <input type="radio" id="Canvas" name="which" value="Canvas"/>
                            <label onClick={handleTabChange} id="Canvas" className="ev_c" for="Canvas">✍Draw</label>
                        </li>
                    </ul>
                    {tab}
                </div>
                <ActiveUsers activeUsers={activeUsers}/>
            </div>
        </>
    )
}

export default Room
