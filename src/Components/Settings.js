import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';

import NavBar from './NavBar';
import Button from './Button';

import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

const Settings = () => {

    const [forename, setForename] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [userId, token, storeToken] = useUser();
    let navigate = useNavigate();


    const fetchUserDetails = async () => {
        try {
            const userDetails = await axios.get(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setForename(userDetails.data.forename);
            setSurname(userDetails.data.surname);
            setEmail(userDetails.data.email);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        void fetchUserDetails();
    }, []);

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const saveChanges = async () => {
        if (forename.length > 0 && surname.length > 0) {

            if (validateEmail()) {
                try {
                    const editDetails = await axios.patch(`${BASE_URL}/users/me`, {
                        forename,
                        surname,
                        email
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setErrorMessage('');
                } catch (e) {
                    console.log(e);
                }
            } else {
                setErrorMessage('Please enter a valid email address.')
            }
        } else {
            setErrorMessage('Please complete all required details.')
        }
        
    };

    const logout = async () => {
        
        try {
            const logoutUser = await axios.post(`${BASE_URL}/users/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })
            
            storeToken('', '');
            navigate(`/`);
        } catch (e) {
            console.log(e);
        }

    };

    const deleteAccount = async () => {
        try {
            const deleteUser = await axios.delete(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })

            storeToken('', '');
            navigate(`/sign-up`);
        } catch (e) {
            console.log(e);
        }
        
    };



    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="settings-wrapper">
                <div className="edit-item-topline">
                    <h1>Settings</h1>
                    <Button buttonText={"Save Changes"} buttonFunction={saveChanges} />
                </div>
                {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
                <div className="edit-item-details">
                    <div className="edit-item-attribute">
                        <label htmlFor="forename" className="edit-item-title">First Name: <span className="asterisk">*</span></label>
                        <textarea 
                            type="text" 
                            required 
                            name="forename" 
                            id="forename"
                            rows="1"
                            value={forename} 
                            className="edit-item-input"
                            onChange={e => setForename(e.target.value)}
                        ></textarea>
                        <label htmlFor="surname" className="edit-item-title">Last Name: <span className="asterisk">*</span></label>
                        <textarea 
                            type="text" 
                            required 
                            name="surname" 
                            id="surname"
                            rows="1"
                            value={surname} 
                            className="edit-item-input"
                            onChange={e => setSurname(e.target.value)}
                        ></textarea>
                        <label htmlFor="email" className="edit-item-title">Email: <span className="asterisk">*</span></label>
                        <textarea 
                            type="text" 
                            required 
                            name="email" 
                            id="email"
                            rows="1"
                            value={email} 
                            className="edit-item-input"
                            onChange={e => setEmail(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className="settings-buttons">
                    <Button buttonText={"Logout"} buttonFunction={logout} />
                </div>
                <div className="settings-buttons">
                    <Button buttonText={"Delete My Account"} buttonFunction={deleteAccount} />
                </div>
            </div>
        </div>
    )
};

export default Settings;