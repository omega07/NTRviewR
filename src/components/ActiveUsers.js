import React from 'react';
import '../styles/ActiveUsers.css';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
const AvatarURL = 'https://avatars.dicebear.com/api/human/';

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

const ActiveUsers = ({activeUsers}) => {
    const classes = useStyles();
    return (
        <div className="online-chat-active">
          <div className="online-status">
            <p className="active-users">Active Users</p>
            {
              activeUsers.map(user => {
                return (
                  <div key={user.userID} className="users">
                    <Avatar className={classes.smaller + " header__avatar"} src={AvatarURL+user.userID+'.svg'}/>
                    <div style={{color:user.typing?'green':'white'}} className="uniq-user">{user.name}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
    )
}

export default ActiveUsers
