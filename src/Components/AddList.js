import React, { useState, forwardRef } from 'react';
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import enGB from 'date-fns/locale/en-GB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import '../App.css';
import "react-datepicker/dist/react-datepicker.css";

import Button from './Button';
import NavBar from './NavBar';

import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';


const AddList = () => {

    const [listName, setListName] = useState('');
    const [date, setDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');

    const [_, token, __] = useUser();
    let navigate = useNavigate();



    const CustomDatePickerInput = forwardRef((props, ref) => {
        return (
            <div className="datepicker">
                <label onClick={props.onClick} ref={ref}>
                    {props.value}
                </label>
                <FontAwesomeIcon icon={faCalendar} onClick={props.onClick} />
            </div>
        )});

    const addListToMyLists = async () => {
        if (listName.length > 0) {
            try {
                const addList = await axios.post(`${BASE_URL}/lists`, {
                    listName,
                    occasionDate: date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const listId = addList.data._id;

                navigate(`/list/${listId}`, {replace: true});
                setErrorMessage('');
            } catch (e) {
                console.log(e)
            }
        } else {
            setErrorMessage('Please fill in a list name.');
        }
    };



    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="edit-item-wrapper">
                <div className="edit-item-topline">
                    <h1>Add New List</h1>
                    <Button buttonText={"Create List"} buttonFunction={addListToMyLists} />
                </div>
                <div className="edit-item-details">
                    <div className="edit-item-attribute">
                        <label htmlFor="listname" className="edit-item-title">List Name<span className="asterisk">*</span></label>
                        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
                        <textarea 
                            type="text" 
                            required 
                            name="listname" 
                            id="listname"
                            rows="1"
                            value={listName} 
                            className="edit-item-input"
                            onChange={e => setListName(e.target.value)}
                        ></textarea>
                        <h1 className="edit-item-title">Date of Occasion</h1>
                        <DatePicker 
                            onChange={setDate} 
                            selected={date} 
                            locale={enGB}
                            minDate={new Date()}
                            dateFormat="dd MMMM yyyy"
                            className="datepicker"
                            autoFocus
                            customInput={<CustomDatePickerInput />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddList;