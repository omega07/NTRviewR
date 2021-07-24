import React, {useRef, useState} from 'react';
import emailValidator from '../utils/emailValidator.js';
import '../styles/Report.css';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import local from '../utils/local.js';
const URL = (local?'http://localhost:8000':window.location.href);

const Report = () => {
    const email = useRef();
    const bug = useRef();
    const history = useHistory();
    const [invalidEmail, setInvalidEmail] = useState('');
    const [error, setError] = useState('');
    const [invalidBug, setInvalidBug] = useState('');
    const handleFormSubmit = e => {
        if(emailValidator(email.current.value)) setInvalidEmail('')
        else {
            setInvalidEmail(<p className="invalid_email">Invalid Email!</p>);
            return;
        }
        if(bug.current.value.length) setInvalidBug('');
        else {
            setInvalidBug(<p className="invalid_bug">Are you trying to scare me!</p>);
            return;
        }
        const bugReport = {
            email: email.current.value,
            bug: bug.current.value
        };
        axios.post(`${URL}/report`, bugReport)
            .then(res => {
                history.push('/');
            })
            .catch(err => {
                setError('Something went wrong! Please try again!');
                return;
            })
    }
    return (
        <div className="report">
            <div className="form_outer">
                <div className="form">
                    <input placeholder="Email" ref={email} className="report__email"/>{invalidEmail}
                    <textarea placeholder="Report bugs..." ref={bug} rows="10" className="report__bug"/>{invalidBug}
                </div>
                    <button className="report__button" onClick={handleFormSubmit}>Send<img className="send_icon" src="https://img.icons8.com/material-outlined/24/000000/filled-sent.png"/></button>
                    {error}
            </div>
        </div>
    )
}

export default Report
