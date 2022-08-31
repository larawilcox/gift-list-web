import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";


import '../App.css';

import { BASE_URL } from '../Constants/Api';

import Button from '../Components/Button';


const ResetPassword = () => {

    const location = useLocation();

    const [username, setUsername] = useState(location.state.username);
    const [errorMessage, setErrorMessage] = useState('');
    const [emailMessageVisible, setEmailMessageVisible] = useState(false);

    let navigate = useNavigate();


    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    const reset = async () => {
        try {
            const resetPassword = await axios.post(`${BASE_URL}/resetpassword`, {
                "email": username,
            })
            
            //alert or modal to say email has been sent to reset password with a close button, then n
            setEmailMessageVisible(true)

            //navigate(`/`, {replace: true});

        } catch (e) {
            console.log(e)
            setErrorMessage('User not found')
        }
    }


    const onSubmitEditing = () => {
        if (username.length > 0) {
            if (validateEmail()) {
                setErrorMessage('');
                reset();
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        } 
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {errorMessage.length > 0 ? <p className="error-text">{errorMessage}</p> : null}
                
                <label htmlFor="username" className="edit-item-title">Email address</label>
                <input 
                    type="text" 
                    required 
                    name="username" 
                    id="username"
                    rows="1"
                    value={username} 
                    className="login-input"
                    onChange={e => setUsername(e.target.value)}
                ></input>
                {emailMessageVisible ? (
                    <div>
                        <p className="email-sent-text">An email to reset your password has been sent to {username}</p> 
                        <div className="forgot-password-button" onClick={() => navigate('/')}>
                            <p className="forgot-password">Return to Login</p>
                        </div>
                    </div> )
                    :
                    null }
                <div className="save-link-button">
                    <Button buttonText="Reset Password" buttonFunction={onSubmitEditing} />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;