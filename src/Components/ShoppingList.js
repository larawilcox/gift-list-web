import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NavBar from './NavBar';
import ItemReserve from './ItemReserve';
import ItemPurchase from './ItemPurchase';

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


const ShoppingList = () => {

    const [sectionListData, setSectionListData] = useState([]);
    const [toggleDetail, setToggleDetail] = useState();
    console.log('section list data: ', sectionListData);
    const [_, token, __] = useUser();

    const fetchData = async () => {
        try {
            const myShoppingList = await axios.get(`${BASE_URL}/users/me/shoppingList`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.log('my shopping list', myShoppingList.data);

            const filteredlistdata = myShoppingList.data.filter(friend => {
               const lists = friend.lists.filter(list => list.items.length > 0)
                if (lists.length > 0) {
                    return {friend: friend};
                }
            })

            //console.log('filteredListData', filteredlistdata);

            const sectionListData = filteredlistdata.map(section => {
                return { title: section.forename, _id: section._id, email: section.email, data: section.lists.map(list => {
                    return { list: list.listName, id: list.listId, data: list.items }
                })}
            });
            setSectionListData(sectionListData);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const Item = ({ item, listId, toggleDetail, setToggleDetail }) => {
       console.log('listId SL: ', listId);
        const itemPrice = priceValueOptions.find(itemPrice => item.price === itemPrice.value);
    
        const getClickableLink = link => {
            return link.startsWith("http://") || link.startsWith("https://") ?
              link
              : `https://${link}`;
          };
    
        return (
            <div onClick={() => setToggleDetail(toggleDetail === item._id ? '' : item._id)}>
                {item._id === toggleDetail ? (
                    <div className="shopping-item">
                        <div className="shopping-details-topline">
                            <p>{item.item}</p>
                            <div className="shopping-icons">
                                <ItemReserve item={item} fetchData={fetchData} listId={listId} />
                                <ItemPurchase item={item} fetchData={fetchData} listId={listId} />
                            </div>
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
                    <div className="shopping-item">
                        <div className="shopping-details-topline">
                            <p>{item.item}</p>
                            <div className="shopping-icons">
                                <ItemReserve item={item} fetchData={fetchData} listId={listId} />
                                <ItemPurchase item={item} fetchData={fetchData} listId={listId} />
                            </div>
                        </div>
                    </div>
                )
                }
            </div>
        )
    };
    

    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="edit-item-wrapper">
                <h1>Shopping List</h1>
                <div className="edit-item-details">
                    {sectionListData.map(friend => {
                        return (
                            <div key={friend._id} className="edit-item-title">
                                <p>{friend.title}'s Gifts</p>
                                {friend.data.map(list => {
                                    if (list.data.length > 0) {
                                    return (
                                        <div key={list.id} className="shopping-list">
                                            <p>{list.list}</p>
                                            {list.data.map(item => {
                                                return (
                                                    <Item 
                                                        listId={list.id}
                                                        key={item._id}
                                                        item={item}
                                                        toggleDetail={toggleDetail}
                                                        setToggleDetail={setToggleDetail} />
                                                )
                                            })}

                                        </div>
                                    )} else {
                                        return null;
                                    }
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

export default ShoppingList;