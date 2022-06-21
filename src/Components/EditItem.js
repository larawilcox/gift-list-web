import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import isURL from 'validator/lib/isURL';

import '../App.css';
import { BASE_URL } from '../Constants/Api';
import useUser from '../Hooks/useUser';

import Button from './Button';
import NavBar from './NavBar';

const EditItem = () => {

    const { listId, itemId } = useParams();
    const { state } = useLocation();


    const [itemDescription, setItemDescription] = useState(state.item);
    const [itemDetail, setItemDetail] = useState(state.detail);
    const [itemPrice, setItemPrice] = useState(state.price); 
    const [links, setLinks] = useState(state.links);
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState('');
    const [selectedLink, setSelectedLink] = useState('');
    const [selectedLinkDescription, setSelectedLinkDescription] = useState('');
    const [selectedLinkLink, setSelectedLinkLink] = useState('')
    const [inputError, setInputError] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    

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


    const saveNewLinkToArray = async (e) => {
        if (isURL(link)) {
            try {
                const editLinks = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                    links: [
                        ...links,
                        {
                            linkDescription: linkDescription,
                            link: link
                        }
                    ]
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }   
                }) 

            setLinks(
                editLinks.data.listItems.find(item => item._id === itemId).links
            );
            setLinkDescription('');
            setLink('');
            setLinkError('');
            setLinkInputVisible(false);

            } catch (e) {
                console.log(e)
            }

        } else {
                setLinkError('This is not a valid URL')
        }   
};

    const editExistingLinkInArray = async () => {
        if (isURL(selectedLinkLink)) {

            try {
                const linkToUpdateIndex = links.findIndex(link => link._id === selectedLink._id)

            if (linkToUpdateIndex >= 0) {
                links[linkToUpdateIndex].linkDescription = selectedLinkDescription;
                links[linkToUpdateIndex].link = selectedLinkLink;

                setSelectedLink('');
                setSelectedLinkDescription('');
                setSelectedLinkLink('');
            }


            const editLinks = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                    links
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }   
                })
            } catch (e) {
                console.log(e)
            }
                
        } else {
            setLinkError('This is not a valid URL')
        }
    };


    const deleteLinkFromArray = async () => {
        const linkToDeleteIndex = links.findIndex(link => link._id === selectedLink._id);
        links.splice(linkToDeleteIndex, 1);

        try {
            const deleteLinks = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                links
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }   
            })

            setLinks(
                deleteLinks.data.listItems.find(item => item._id === itemId).links
            );
        } catch (e) {
            console.log(e)
        }
    };

    const priceUpdate = (option) => {
        if (typeof(option) === 'object') {
            setItemPrice(option.value)
        } else {
            setItemPrice(option)
        }
    };


    const saveItemChanges = async () => {

        if (itemDescription.length > 0 && itemPrice && itemPrice.length > 0) {
        try {
            const editItem = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                item: itemDescription,
                detail: itemDetail,
                price: itemPrice,
                links
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            navigate(-1);
        } catch (e) {
            console.log(e)
        }
    } else {
        setInputError('Please complete all required fields, marked with a *.')
    }
    }

    const deleteItemFromChosenList = async () => {
        if (state.actions.action === '') {
        try {
            const deletedItem = await axios.delete(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate(`/list/${listId}`)
        } catch (e) {
            console.log(e)
        }} else {
            setDeleteMessage('Cannot be deleted. This item has been reserved.')
        }
    }

   

    return (
        <div className="container">
            <div className="nav-wrapper">
                <NavBar />
            </div>
            <div className="edit-item-wrapper">
                <div className="edit-item-topline">
                    <h1>Edit Item</h1>
                    <Button buttonText={"Save Changes"} buttonFunction={saveItemChanges} />
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
                                (selectedLink._id && link._id === selectedLink._id) ? (
                                    <div key={i} className="link-chunk">
                                        <div className="edit-item-attribute">
                                            <label htmlFor="linkdesc" className="edit-item-title">Link Description</label>
                                            <textarea 
                                                type="text" 
                                                name="linkdesc" 
                                                id="linkdesc"
                                                rows="2"
                                                value={selectedLinkDescription} 
                                                className="edit-item-input"
                                                onChange={e => setSelectedLinkDescription(e.target.value)}
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
                                                value={selectedLinkLink} 
                                                className="edit-item-input"
                                                onChange={e => setSelectedLinkLink(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <div className="delete-link-button" onClick={deleteLinkFromArray}>
                                                <p className="delete-button-text">Delete this link</p>
                                                <FontAwesomeIcon icon={faTrashCan} className="delete-icon" />
                                            </div>
                                        </div>
                                        <div className="edit-link-button">
                                            <Button buttonText={"Save Changes"} buttonFunction={editExistingLinkInArray} />
                                            <Button buttonText={"Cancel"} buttonFunction={() => {setSelectedLink(''); setSelectedLinkDescription(''); setSelectedLinkLink('')}} />
                                        </div>
                                    </div>
                                ) : (
                                <div key={i} className="link-chunk">
                                    <div className="edit-link">
                                        <p className="link-description">{link.linkDescription}</p>
                                        <div onClick={() => {setSelectedLink(link); setSelectedLinkDescription(link.linkDescription); setSelectedLinkLink(link.link)}} className="icon">
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </div> 
                                    </div>
                                    <p className="link">{link.link}</p> 
                                </div>
                                )
                            ))}
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
                                    {/* {linkDescription.length > 0 ? (
                                        <div className="icon-textarea" onClick={() => setLinkDescription('')}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                        ) : null
                                    }     */}
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
                                    <Button buttonText={"Save Link"} buttonFunction={saveNewLinkToArray} />
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
                {deleteMessage ? <p className="error-text">{deleteMessage}</p> : null}
                <div className="delete-button" onClick={deleteItemFromChosenList}>
                    <p className="delete-button-text">Delete this item</p>
                    <FontAwesomeIcon icon={faTrashCan} className="delete-icon" />
                </div>
            </div>
        </div>
    )
}

export default EditItem;