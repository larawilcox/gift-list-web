import React, { useState } from 'react';

let storedToken = sessionStorage.getItem('token');
let storedUser = sessionStorage.getItem('userId');

function useUser() {

    const [userId, setUserId] = useState(storedUser);
    const [token, setToken] = useState(storedToken);

    function storeUser(myUser, myToken) {
        sessionStorage.setItem('userId', myUser);
        sessionStorage.setItem('token', myToken);
        storedUser = myUser;
        storedToken = myToken;
        setUserId(myUser);
        setToken(myToken);
    }

    return (
        [userId, token, storeUser]
    );
};

export default useUser;