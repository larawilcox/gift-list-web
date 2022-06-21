import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faGear, faUserGroup, faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

import '../App.css';



const NavBar = () => {

    return (
        <div className="navbar">
            <Link to={`/my-lists`} className="nav-item">
                <FontAwesomeIcon icon={faList} className="nav-icon" />
                <h1>My Lists</h1>
            </Link>
            <Link to={`/subscribed-lists`} className="nav-item">
                <FontAwesomeIcon icon={faUserGroup} className="nav-icon" />
                <h1>Friends' Lists</h1>
            </Link>
            <Link to={`/shopping-list`} className="nav-item">
                <FontAwesomeIcon icon={faBasketShopping} className="nav-icon" />
                <h1>Shopping List</h1>
            </Link>
            <Link to={`/settings`} className="nav-item">
                <FontAwesomeIcon icon={faGear} className="nav-icon" />
                <h1>Settings</h1>
            </Link>
        </div>
    )
}

export default NavBar;