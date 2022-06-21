import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { customAlphabet } from 'nanoid/non-secure';

import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

import '../App.css';
import NavBar from './NavBar';
import Button from './Button';

const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];

const ListItem = ({ item, listId, toggleDetail, setToggleDetail }) => {
    
    const itemPrice = priceValueOptions.find(itemPrice => item.price === itemPrice.value);

    const getClickableLink = link => {
        return link.startsWith("http://") || link.startsWith("https://") ?
          link
          : `https://${link}`;
      };

    return (
        <div onClick={() => setToggleDetail(toggleDetail === item._id ? '' : item._id)}>
            {item._id === toggleDetail ? (
                <div className="item-details">
                    <div className="item-details-topline">
                        <p>{item.item}</p>
                        <Link to={`/list/${listId}/item/${item._id}`} state={item} className="icon">
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Link>
                    </div>
                    <div className="details">
                        {item.price ?  
                        <p>{itemPrice.label}</p>
                        : null
                        }
                        {item.detail ?
                        <p>{item.detail}</p>
                        : null
                        }
                        {item.links ? 
                            item.links.map((link, i) => 
                                <a href={getClickableLink(link.link)} key={i} target="_blank">{link.linkDescription ? link.linkDescription : 'Link'}</a>
                            )
                        : null
                        }
                    </div>
                </div>
            ) : (
                <div className="item-details">
                    <div className="item-details-topline">
                        <p>{item.item}</p>
                        <Link to={`/list/${listId}/item/${item._id}`} state={item} className="icon">
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Link>
                    </div>
                </div>
            )
            }
        </div>
    )
};

const ChosenList = () => {

    const { listId } = useParams();
    const [myCurrentList, setMyCurrentList] = useState({});
    const [toggleDetail, setToggleDetail] = useState();
    const [shareCodeVisible, setShareCodeVisible] = useState(false);
    const [shareListCode, setShareListCode] = useState('');
    const [_, token, __] = useUser();
    let navigate = useNavigate();


    const fetchData = async () => {
        
        try {
            const myList = await axios.get(`${BASE_URL}/lists/${listId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyCurrentList(myList.data); 
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, [listId]);


    const AddNewItem = () => {
        navigate(`/list/${listId}/new-item`);
    };

    const shareCode = async () => {
        try {
            const nanoid = customAlphabet('1234567890abcdef', 10);
            const code = nanoid();
            const myCode = await axios.post(`${BASE_URL}/shareCodes`, {
                listId,
                shareCode: code
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(myCode);
            setShareListCode(code);
            setShareCodeVisible(true);
            // const shareResponse = await Share.open({message: `To see my gift list, please enter code ${code} into your app.`});
        } catch(e) {
            console.log(e);
        }
      };

    
    if (Object.keys(myCurrentList).length > 0) {
        return (
            <div className="container">
                <div className="nav-wrapper">
                    <NavBar />
                </div>
                <div className="chosen-list-wrapper">
                    <div className="edit-item-topline">
                        <h1>{myCurrentList.listName}</h1>
                        <Button buttonText={"Share this List"} buttonFunction={shareCode} />
                    </div>
                    {shareCodeVisible ? (
                        <div className="share-code-wrapper">
                            <p className="share-code-text">To share your list, please send code</p>
                            <p className="share-code-text-code">{shareListCode}</p>
                            <p className="share-code-text">to friends and family.  They can use this code in their app or online to see your list.</p>
                            <a href={`mailto:?subject=I have shared my gift list with you.&body=To view my list please enter code ${shareListCode} in your No More Socks app or online.`}>Send code by email</a>
                        </div>
                    ) : null}
                    {(myCurrentList.listItems.length > 0) ? (
                        myCurrentList.listItems.map((listItem, i) => {
                            return (
                                <ListItem
                                    key={i}  
                                    item={listItem}
                                    listId={listId}
                                    toggleDetail={toggleDetail}
                                    setToggleDetail={setToggleDetail}
                                />
                            );
                    })) : <p className="empty-list-text">There are no items on your list</p>}
                    <Button buttonText={"Add a new item"} buttonFunction={AddNewItem} />
                </div>
            </div>
           
        )
    } else {
        return null;
    }
    
}

export default ChosenList;