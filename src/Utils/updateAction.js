import axios from 'axios';

import { BASE_URL } from '../Constants/Api';





const updateAction = async ({ item, action, userId, token, fetchData, listId }) => {
    
    //action on a particular item has to be object of personId and 
    //action of either reserved or purchased
    const itemId = item._id;
   
    if (item.actions.personId === '') {

        // console.log(userId)
        // console.log(action)

        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: userId,
                action: action
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchData();
            
        } catch (e) {
            console.log(e)
        }
    } else if (item.actions.personId === userId && item.actions.action === action) {
        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: '',
                action: ''
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchData();

        } catch (e) {
            console.log(e)
        }
    } else if (item.actions.personId === userId && item.actions.action !== action) {
        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: userId,
                action: action
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            fetchData();

        } catch (e) {
            console.log(e)
        }
    }
}

export default updateAction;