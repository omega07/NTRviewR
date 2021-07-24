import React, { useState, useEffect, useRef } from 'react';
import Home from './components/Home.js'
import Header from './components/Header.js';
import Room from './components/Room.js';
import ActiveUsers from './components/ActiveUsers.js';
import './App.css';
import { Modal } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import {io} from 'socket.io-client';
import local from './utils/local.js';
import Report from './components/Report.js';
const URL = (local?'http://localhost:8000':window.location.href);

const App = () => {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState('');
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(URL));
  }, [])

  return (
    <Router>
      <div>
        <Header userID={userID} username={username} />
        <Switch>
          <Route exact path="/">
            <Home userID={userID} username={username} setUserID={setUserID} setUsername={setUsername} setActiveUsers={setActiveUsers} socket={socket} />
          </Route>
          <Route path="/room/:id">
            <Room userID={userID} username={username} setUserID={setUserID} setUsername={setUsername} activeUsers={activeUsers} setActiveUsers={setActiveUsers} socket={socket}/>
          </Route>
          <Route path="/report">
            <Report/>
          </Route>
          <Redirect to="/"/>
        </Switch>
      </div>
    </Router>
  )
}

export default App
