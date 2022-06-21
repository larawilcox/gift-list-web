import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import NavBar from './NavBar';
import Button from './Button';

import '../App.css';
import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

const SubscribedLists = () => {

    const [sectionListData, setSectionListData] = useState([]);
    const [addListVisible, setAddListVisible] = useState(false);
    const [sharecode, setSharecode] = useState('');
    const [subscribeCodeError, setSubscribeCodeError] = useState('');

    const [_, token, __] = useUser();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const mySubscribedLists = await axios.get(`${BASE_URL}/users/me/subscribedLists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const sectionListData = mySubscribedLists.data.map(section => {
                return { title: section.forename, _id: section._id, email: section.email, data: section.lists.map(list => {
                    return { list: list.listName, id: list._id, data: list.listItems }
                })}
            });
            setSectionListData(sectionListData);
            console.log(sectionListData);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const subscribe = async () => {
        try {

            const subscribeToList = await axios.patch(`${BASE_URL}/users/me/subscribedLists`, {
                shareCode: sharecode
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                }
            });
            setAddListVisible(false);
            setSubscribeCodeError('');
            void fetchData();
        } catch (e) {
            console.log(e.response);
            if (e.response && e.response.status === 409) {
                setSubscribeCodeError("You're already subscribed to this list")
            } else {
                setSubscribeCodeError('This is not a valid code.');
            }
        }
    };

    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="edit-item-wrapper">
                <div className="edit-item-topline">
                    <h1>Subscribed Lists</h1>
                    <Button buttonText={"Add new list"} buttonFunction={() => setAddListVisible(true)} />
                </div>
                {addListVisible ? (
                    <div className="friends-subscribe-wrapper">
                        <div className="friends-subscribe-topline">
                            <label htmlFor="sharecode" className="friends-share-code">Enter your share code:</label>
                            <div onClick={() => setAddListVisible(false)} className="friends-close-icon">
                                <FontAwesomeIcon icon={faXmark} className="icon" />
                            </div>
                        </div>
                    <textarea 
                            type="text" 
                            required 
                            name="sharecode" 
                            id="sharecode"
                            rows="3"
                            value={sharecode} 
                            className="share-code-input"
                            onChange={e => setSharecode(e.target.value)}
                            placeholder="enter code here"
                    ></textarea>
                    { subscribeCodeError ? <p className="error-text">{subscribeCodeError}</p> : null }
                    <Button buttonText={"Subscribe"} buttonFunction={subscribe} />
                </div>
                ) : null}
                
                <div className="edit-item-details">
                    {sectionListData.map(friend => {
                        return (
                            <div key={friend._id} className="edit-item-title">
                                <p>{friend.title}'s Lists</p>
                                {friend.data.map(list => {
                                    // console.log(friend.title)
                                    return (
                                        <div key={list.id} className="friends-list" onClick={() => navigate(`/subscribed-lists/${list.id}`, {state: {listId: list.id, friend: friend.title, friendId: friend._id}})}>
                                            <p className="friends-list-name">{list.list}</p>
                                            <FontAwesomeIcon icon={faChevronRight} className="icon" />
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

export default SubscribedLists;