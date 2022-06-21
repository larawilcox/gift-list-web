import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import '../App.css';
import useUser from '../Hooks/useUser';
import updateAction from '../Utils/updateAction';


const ItemReserve = ({item, fetchData, listId}) => {

    const [userId, token, __] = useUser();
    console.log('listId', listId);
        
    if (item.actions.personId === userId && item.actions.action === 'reserved') {
        return (
            <div onClick={() => updateAction({ item, action: 'reserved', userId, token, fetchData, listId })} className="shopping-icon-button">
                <FontAwesomeIcon icon={faLockOpen} className="icon" />
            </div>
        )
    } else if (item.actions.personId === userId && item.actions.action === 'purchased') {
        return null;
    } else {
        return (
            <div onClick={() => updateAction({ item, action: 'reserved', userId, token, fetchData, listId })} className="shopping-icon-button">
                <FontAwesomeIcon icon={faLock} className="icon" />
            </div>
        )
    }
};

export default ItemReserve;