import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import NavBar from './NavBar';
import ItemPurchase from './ItemPurchase';
import ItemReserve from './ItemReserve';

import '../App.css';
import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';


const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];

const SubscribedToList = () => {

    const { state } = useLocation();
    const [data, setData] = useState();
    const [toggleDetail, setToggleDetail] = useState();
    

    const [userId, token, __] = useUser();

    const fetchData = async () => {
        try {
            const mySubscribedLists = await axios.get(`${BASE_URL}/users/me/subscribedLists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const myChosenSubscribedFriend = mySubscribedLists.data.find(friend => friend._id === state.friendId);
            const myChosenSubscribedList = myChosenSubscribedFriend.lists.find(list => list._id === state.listId)

            setData(myChosenSubscribedList);
            
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    


const Item = ({item, fetchData, listId}) => {
       
        const itemPrice = priceValueOptions.find(itemPrice => item.price === itemPrice.value);

        
        if (item.actions.action !== '' && item.actions.personId !== userId) {
            return (
                <div className="friends-list-deactivated">
                    <div className="friends-list-topline">
                        <p>{item.item}</p>
                        <p className="friends-list-topline-bold">{item.actions.action}</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={item._id} className="friends-list">
                        {item._id === toggleDetail ? (
                            <div onClick={() => setToggleDetail(toggleDetail === item._id ? '' : item._id)} className="friends-list-container">
                                <div className="friends-list-topline">
                                    <p className="friends-list-topline-bold">{item.item}</p>
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
                            <div onClick={() => setToggleDetail(toggleDetail === item._id ? '' : item._id)} className="friends-list-container">
                                <div className="friends-list-topline">
                                    <p>{item.item}</p>
                                </div>
                            </div>
                        )
                        }
                    <div className="shopping-icons">
                        <ItemReserve item={item} fetchData={fetchData} listId={listId} />
                        <ItemPurchase item={item} fetchData={fetchData} listId={listId} />
                    </div>
                </div>
            )
        }
        
    };


    const getClickableLink = link => {
        return link.startsWith("http://") || link.startsWith("https://") ?
          link
          : `https://${link}`;
      };

   
        { if (data) {
            return (
                <div className="container">
                    <div className="nav-wrapper">
                        <NavBar />
                    </div>
                    <div className="edit-item-wrapper">
                        <h1>{state.friend}'s Lists</h1>
                        <p className="edit-item-title">{data.listName}</p>
                        {(data.listItems.length > 0) ? (
                        <div className="edit-item-details">
                            {data.listItems.map(item => {
                                {console.log('list id in item', data._id)}
                                return (
                                    <Item key={item._id} item={item} listId={data._id} fetchData={fetchData} />
                                ) 
                            })}
                        </div>
                        ) : (
                            <div>
                                <p >There are no items on this list</p>
                            </div>
                        )}
                        
                    </div>
                </div>
            )
        } else {
            return null;
        }}
        
    
};

export default SubscribedToList;