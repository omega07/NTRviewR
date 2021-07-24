import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = ({username}) => {
    return (
        <div className="landing">
            Welcome to the Room! {username}
        </div>
    )
}

export default LandingPage
