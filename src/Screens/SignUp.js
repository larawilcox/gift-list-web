import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";


import '../App.css';

import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

import Button from '../Components/Button';


const SignUp = () => {

    const [forename, setForename] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [userId, token, storeToken] = useUser();
    let navigate = useNavigate();

    const login = () => {
        navigate('/');
    };

    const signup = async () => {

        try {
            const signup = await axios.post(`${BASE_URL}/users`, {
                "forename": forename,
                "surname": surname,
                "email": username,
                "password": password
            })
            
            storeToken(signup.data.user._id, signup.data.token);
            console.log(signup);
            navigate(`/my-lists/`, {replace: true});

        } catch (e) {
            console.log(e)
            if (e.response.data.message) {
                setErrorMessage('Your password cannot contain the word password')
            } else {
                setErrorMessage('An account with this email address already exists')
            }
            
        }
    }

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    const validatePassword = () => {
        if (password.length < 7) {
            setErrorMessage('Your password must have at least 7 characters');
        }
    };

    const onSubmitEditing = () => {
        if (forename.length > 0 && surname.length > 0 && username.length > 0 && password.length > 6) {
            if (validateEmail()) {
                signup();
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        } 
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h1>Sign up</h1>
                {errorMessage.length > 0 ? <p className="error-text">{errorMessage}</p> : null}
                <label htmlFor="forename" className="edit-item-title">Forename</label>
                <input 
                    type="text" 
                    required 
                    name="forename" 
                    id="forename"
                    rows="1"
                    value={forename} 
                    className="login-input"
                    onChange={e => setForename(e.target.value)}
                ></input>
                <label htmlFor="surname" className="edit-item-title">Surname</label>
                <input 
                    type="text" 
                    required 
                    name="surname" 
                    id="surname"
                    rows="1"
                    value={surname} 
                    className="login-input"
                    onChange={e => setSurname(e.target.value)}
                ></input>
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
                    onBlur={validatePassword}
                ></input>
                <div className="save-link-button">
                    <Button buttonText="SignUp" buttonFunction={onSubmitEditing} />
                </div>
                <p className="login-text">------------------------  or  ------------------------</p>
                <div className="save-link-button">
                    <Button buttonText="Login" buttonFunction={login} />
                </div>
            </div>
        </div>
    );
};

export default SignUp;