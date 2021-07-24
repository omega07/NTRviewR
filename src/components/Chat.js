import React, {useState,useRef,useEffect} from 'react';
import '../styles/Chat.css';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ActiveUsers from './ActiveUsers.js';
import moment from 'moment';
import {randomColor} from '../utils/randomColor.js';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  smaller: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  }
}));

const AvatarURL = 'https://avatars.dicebear.com/api/human/';


const Chat = ({userID, username, activeUsers, socket, setActiveUsers}) => {
    const messageRef = useRef();
    const chatWindowRef = useRef();
    const classes = useStyles();
    const [userMessages, setUserMessages] = useState([]);
    useEffect(() => {
        const data = {
            'userID':userID,
            'username': username,
            'message': ""
        }
        socket.emit('message', data);
    }, [])

    const handleMessageSend = e => {
        const data = {
            'userID':userID,
            'username': username,
            'message': messageRef.current.value,
            'time' : moment().format('h:mm a')
        }
        messageRef.current.value = "";
        socket.emit('message', data);
    }

    socket.on('new-message', data => {
        setUserMessages(data);
    })

    return (
        <div className="outer_chat">
            <div className="chat">
                <div ref={chatWindowRef} className="chat__window">
                    {
                        userMessages.map((userInfo, index) => {
                            return (
                                <div key={index} style={{float:(userInfo.userID===userID?"right":"left"), backgroundColor:(userInfo.userID===userID?"rgba(76, 76, 134, 0.815)":"rgba(140, 160, 201, 0.815)")}} className="message">
                                    <div className="message__username"><Avatar className={classes.smaller} src={AvatarURL+userInfo.userID+'.svg'}/>{userInfo.username} <div style={{marginLeft:"5px"}} className="chat__time">{userInfo.time}</div></div>
                                    <div style={{color:"white"}} className="message__message">{userInfo.message}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="input_message_and_button">
                    <input autoFocus={true} ref={messageRef} type="text" className="input_message_box" size="1" placeholder="Enter message"/>
                    <input onClick={handleMessageSend} value="Send" type="submit" className="send_button"/>
                </div>
            </div>
        </div>
    )
}

export default Chat
