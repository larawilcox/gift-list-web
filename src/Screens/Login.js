import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


import '../App.css';

import { BASE_URL } from '../Constants/Api';

import Button from '../Components/Button';
import useUser from '../Hooks/useUser';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const [userId, token, storeToken] = useUser();
    let navigate = useNavigate();

    const signUp = () => {
        navigate(`/sign-up`);
    };

    const login = async () => {
        
        try {
            const login = await axios.post(`${BASE_URL}/users/login`, {
                "email": username,
                "password": password
            })

            
            storeToken(login.data.user._id, login.data.token);
            navigate(`my-lists/`, {replace: true});

            console.log('signed in')
        } catch (e) {
            console.log(e)
            setErrorMessage('Please enter a valid username and password.')
        }
    };

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    useEffect(() => {
            if (token) {
                navigate(`my-lists/`);
            }
    }, [token]);

    const onSubmitEditing = () => {
        if (password.length > 6 && username.length > 0) {
            if (validateEmail()) {
                login()
                console.log('signed in')
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        } else if (password.length < 7 && username.length > 0) {
            setErrorMessage('Please enter a password of at least 7 characters')
        } else if (username.length === 0) {
            setErrorMessage('Please enter a valid username')
        }
    };


    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h1>Login</h1>
                {errorMessage.length > 0 ? <p className="error-text">{errorMessage}</p> : null}
                <label htmlFor="username" className="edit-item-title">Username</label>
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
                <label htmlFor="password" className="edit-item-title">Password</label>
                <input 
                    type="password" 
                    required 
                    name="password" 
                    id="password"
                    rows="1"
                    value={password} 
                    className="login-input"
                    onChange={e => setPassword(e.target.value)}
                ></input>
                <div className="forgot-password-button" onClick={() => navigate('reset-password', {state: {username: username}})}>
                    <p className="forgot-password">Forgot Password?</p>
                </div>
                <div className="save-link-button">
                    <Button buttonFunction={onSubmitEditing} buttonText="Login" />
                </div>
                <p className="login-text">------------------------  or  ------------------------</p>
                <div className="save-link-button">
                    <Button buttonText="Sign Up" buttonFunction={signUp} />
                </div>
            </div>
        </div>
    );
};

export default Login;