import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import isURL from 'validator/lib/isURL';

import '../App.css';
import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

import Button from './Button';
import NavBar from './NavBar';



const AddItem = () => {

    const { listId } = useParams();


    const [itemDescription, setItemDescription] = useState('');
    const [itemDetail, setItemDetail] = useState('');
    const [itemPrice, setItemPrice] = useState(''); 
    const [links, setLinks] = useState([]);
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState('');
    const [selectedLink, setSelectedLink] = useState('');
    const [selectedLinkDescription, setSelectedLinkDescription] = useState('');
    const [selectedLinkLink, setSelectedLinkLink] = useState('')
    const [inputError, setInputError] = useState('');
    
    const [_, token, __] = useUser();
    let navigate = useNavigate();

    const priceValueOptions = [
        { label: 'Unspecified', value: '0' },
        { label: 'Under £10', value: '1' },
        { label: '£10-£20', value: '2' },
        { label: '£20-£50', value: '3' },
        { label: '£50-£100', value: '4' },
        { label: 'Over £100', value: '5' },
    ];

    useEffect(() => {
        if (!!itemPrice) {
            setInputError('')
        }
    }, [itemPrice])

    const priceUpdate = (option) => {
        if (typeof(option) === 'object') {
            setItemPrice(option.value)
        } else {
            setItemPrice(option)
        }
    };

    const saveNewLink = () => {
        if (isURL(link)) {
            setLinks([
                ...links,
                {
                    linkDescription: linkDescription,
                    link: link
                }
            ]);
            setLinkDescription('');
            setLink('');
            setLinkError('');
            setLinkInputVisible(false);
        } else {
                setLinkError('This is not a valid URL')
        }
    };

    const AddItemToList = async () => {
        if (itemDescription.length > 0 && itemPrice && itemPrice.length > 0) {
            try {
                const addedItemToList = await axios.post(`${BASE_URL}/lists/${listId}`, {
                    item: itemDescription,
                    detail: itemDetail,
                    price: itemPrice,
                    links: links,
                    actions: {
                        personId: '',
                        action: ''
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setItemDescription('');
                setItemDetail('');
                setLinks([]);
                setItemPrice('');
                setInputError('');

                navigate(-1);
            } catch (e) {
                console.log(e)
            }
        } else {
                setInputError('Please complete all required fields, marked with a *.')
            }
    };



    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="edit-item-wrapper">
                <div className="edit-item-topline">
                    <h1>Add New Item</h1>
                    <Button buttonText={"Save Changes"} buttonFunction={AddItemToList} />
                </div>
                {inputError ? <p className="error-text">{inputError}</p> : null}
                <div className="edit-item-details">
                    <div className="edit-item-attribute">
                        <label htmlFor="itemdesc" className="edit-item-title">Item Description <span className="asterisk">*</span></label>
                        <textarea 
                            type="text" 
                            required 
                            name="itemdesc" 
                            id="itemdesc"
                            rows="3"
                            value={itemDescription} 
                            className="edit-item-input"
                            onChange={e => setItemDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="edit-item-attribute">
                        <label htmlFor="itemdetail" className="edit-item-title">Item Detail</label>
                        <textarea 
                            type="text" 
                            name="itemdetail" 
                            id="itemdetail"
                            rows="3"
                            value={itemDetail} 
                            className="edit-item-input"
                            onChange={e => setItemDetail(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="edit-item-attribute">
                        <label htmlFor="itemprice" className="edit-item-title">Price Range <span className="asterisk">*</span></label>
                        <Dropdown options={priceValueOptions} onChange={priceUpdate} value={itemPrice} placeholder="Select an option" className="edit-item-dropdown" />
                    </div>
                </div>

                <div className="edit-item-details">
                    <div className="edit-item-attribute">
                        <p className="edit-item-title">Links</p>
                        <div className="link-wrapper">
                            {links.map((link,i) => (
                                <div key={i} className="link-chunk">
                                    <p className="link-description">{link.linkDescription}</p>
                                    <p className="link">{link.link}</p> 
                                </div>
                                )
                            )}
                        </div>

                        {linkInputVisible ? (
                            <div className="link-chunk">
                                <p className="link-description">Add a link</p>
                                <div className="edit-item-attribute">
                                    <label htmlFor="linkdesc" className="edit-item-title">Link Description</label>
                                    <textarea 
                                        type="text" 
                                        name="linkdesc" 
                                        id="linkdesc"
                                        rows="2"
                                        value={linkDescription} 
                                        className="edit-item-input"
                                        onChange={e => setLinkDescription(e.target.value)}
                                    >
                                    </textarea>
                                </div>
                                <div className="edit-item-attribute">
                                    <label htmlFor="link" className="edit-item-title">Link</label>
                                    <textarea 
                                        type="text" 
                                        required 
                                        name="link" 
                                        id="link"
                                        rows="5"
                                        value={link} 
                                        className="edit-item-input"
                                        onChange={e => setLink(e.target.value)}
                                    ></textarea>
                                </div>

                                {linkError ? (
                                        <p className="error-text">{linkError}</p>    
                                    ) : null }

                                <div className="save-link-button">
                                    <Button buttonText={"Save Link"} buttonFunction={saveNewLink} />
                                </div>
                            </div>
                        ) : (
                            <div className="add-link-button" onClick={() => setLinkInputVisible(true)}>
                                <p className="add-link-button-text">Add a link</p>
                                <FontAwesomeIcon icon={faPlus} className="add-icon" />
                            </div>
                        )}
 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddItem;