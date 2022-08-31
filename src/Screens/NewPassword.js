import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";


import '../App.css';

import { BASE_URL } from '../Constants/Api';

import Button from '../Components/Button';


const NewPassword = () => {

   
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    let [searchParams, setSearchParams] = useSearchParams();
        

    const changePassword = async () => {
        
        const resetcode = searchParams.get('resetcode')
        
        try {
            const changePassword = await axios.patch(`${BASE_URL}/changepassword`, {
                password,
                resetcode
            })
        } catch (e) {
            console.log(e)
            console.log('error message: ', e.response.data.error)
            if (e.response.data.error === 'Reset code not found') {
                setErrorMessage('Password change request not found. Please try Forgot Password again.')
                //do we need a link or redirect here?
            } else if (e.response.data.error === 'Reset code expired') {
                setErrorMessage('This link has expired.')
            } else if (e.response.data.error === 'User not found') {
                setErrorMessage('User not found')
            } else {
                setErrorMessage('Password change failed')
            }
                
        }
    }


    const onSubmitEditing = () => {
        if (password.length > 6) {
            if (password === confirmPassword) {
                changePassword()
                setErrorMessage('')
            } else {
                setErrorMessage('Please check passwords match')
            }
        } else {
            setErrorMessage('Please enter a password of at least 7 characters')
        }
        
    }
    
   
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h1 className="new-password-title">New password</h1>
                {errorMessage.length > 0 ? <p className="error-text">{errorMessage}</p> : null}
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
                <label htmlFor="confirmPassword" className="edit-item-title">Confirm Password</label>
                <input 
                    type="password" 
                    required 
                    name="confirmPassword" 
                    id="confirmPassword"
                    rows="1"
                    value={confirmPassword} 
                    className="login-input"
                    onChange={e => setConfirmPassword(e.target.value)}
                ></input>
                
                <div className="save-link-button">
                    <Button buttonFunction={onSubmitEditing} buttonText="Change password" />
                </div>
            </div>
        </div>
    );
};

export default NewPassword;