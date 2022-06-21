import React, { useState, useEffect, forwardRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import enGB from 'date-fns/locale/en-GB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCalendar, faCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../App.css';

import Button from './Button';
import NavBar from './NavBar';

import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser'; 




const Item = ({ list, listId, listDate, editList, setEditList, listName, setListName, date, setDate, token }) => {

  const [errorMessage, setErrorMessage] = useState('');

  const EditList = async () => {
    if (listName.length > 0) {

      try {
        const editList = await axios.patch(`${BASE_URL}/lists/${listId}`, {
            listName,
            occasionDate: date,

        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setEditList('');
        setErrorMessage('');
    } catch (e) {
        console.log(e)
    }


    } else {
      setErrorMessage('Please fill in a list name.');
    } 
};

const deleteListFromMyLists = async () => {
  try {
      const deletedList = await axios.delete(`${BASE_URL}/lists/${listId}`, {
          headers: {
              Authorization: `Bearer ${token} `
          }
      })  
  } catch (e) {
      console.log(e)
  }

  setEditList('');
  setErrorMessage('');

};


  const CustomDatePickerInput = forwardRef((props, ref) => {
    return (
        <div className="datepicker">
            <label onClick={props.onClick} ref={ref}>
                {props.value}
            </label>
            <FontAwesomeIcon icon={faCalendar} className="calendar-icon" onClick={props.onClick} />
        </div>
    )});

  // console.log('date', date);
    return (
        <nav className="list-link-wrapper">
          {editList === listId ? (
            <div className="list-name">
              <div className="edit-list-attribute">
                <div className="edit-list-topline">
                  <label htmlFor="listname" className="edit-list-title">List Name<span className="asterisk">*</span></label>
                  <div className="save-button" onClick={EditList}>
                    <FontAwesomeIcon icon={faCheck} className="save-list-icon" />
                  </div>
                </div>
                  {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
                  <textarea 
                      type="text" 
                      required 
                      name="listname" 
                      id="listname"
                      rows="1"
                      value={listName} 
                      className="edit-list-input"
                      onChange={e => setListName(e.target.value)}
                  ></textarea>
                  
                  <h1 className="edit-item-title">Date of Occasion</h1>
                  <DatePicker 
                      onChange={date => setDate(date)} 
                      selected={date} 
                      locale={enGB}
                      minDate={new Date()}
                      dateFormat="dd MMMM yyyy"
                      className="datepicker"
                      autoFocus
                      customInput={<CustomDatePickerInput />}
                  />
                  {/* {deleteMessage ? <p className="error-text">{deleteMessage}</p> : null} */}
                  <div className="delete-button" onClick={deleteListFromMyLists}>
                      <p className="delete-button-text">Delete this list</p>
                      <FontAwesomeIcon icon={faTrashCan} className="delete-icon" />
                  </div>
                </div>
            </div>
          ) : (
            <div className="list-name">
              <Link to={`/list/${listId}`} className="link">
                <p>{list}</p>
              </Link>
              <div onClick={() => {setEditList(listId); setListName(list); setDate(new Date(listDate));}} className="edit-list">
                  <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
              </div>
            </div>
          )}  
        </nav>
    )
};


const MyLists = () => {

    const [listData, setListData] = useState([]);
    const [editList, setEditList] = useState('');
    const [listName, setListName] = useState();
    const [date, setDate] = useState();

    // console.log('listId: ', editList)


    const [_, token, __] = useUser();
    let navigate = useNavigate();


    const fetchData = async () => {
      try {
          
          const myLists = await axios.get(`${BASE_URL}/lists`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          setListData(myLists.data);
      } catch (e) {
          console.log(e);
      }
  };

const AddNewList = () => {
    navigate('add-list/');
};


  useEffect(() => {
    if (editList === '') {
      void fetchData();
    }
  }, [editList]);


    return (
      <div className="container">
        <div className="nav-wrapper">
          <NavBar />
        </div>
        <div className="my-lists">
            <h1>My Lists</h1>
            {listData.map(list => {
                return (
                    <Item 
                      key={list._id} 
                      list={list.listName} 
                      listId={list._id} 
                      listDate={list.occasionDate}
                      editList={editList} 
                      setEditList={setEditList} 
                      listName={listName}
                      setListName={setListName}
                      date={date}
                      setDate={setDate}
                      token={token}
                    />
                )
            })}
            <Button buttonText={"Add a new list"} buttonFunction={AddNewList} />
        </div>
      </div>
    )


};

export default MyLists;