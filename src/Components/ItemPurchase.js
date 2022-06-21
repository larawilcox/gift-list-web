import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { BsCartX } from 'react-icons/bs';

import '../App.css';
import useUser from '../Hooks/useUser';
import updateAction from '../Utils/updateAction';



const ItemPurchase = ({item, fetchData, listId}) => {

    const [userId, token, __] = useUser();

    if (item.actions.personId === userId && item.actions.action === 'purchased') {
        return (
            <div onClick={() => updateAction({ item, action: 'purchased', userId, token, fetchData, listId })} className="shopping-icon-button">
                <BsCartX className="icon" />
            </div>
        )
    } else {
        return (
            <div onClick={() => updateAction({ item, action: 'purchased', userId, token, fetchData, listId })} className="shopping-icon-button">
                <FontAwesomeIcon icon={faCartShopping} className="icon" />
            </div>
        )
    }
};

export default ItemPurchase;