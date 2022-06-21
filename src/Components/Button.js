import React, { useState } from 'react';
import '../App.css';

const Button = ({ type, buttonText, buttonFunction }) => {
    
    return (
        <div className="button" onClick={buttonFunction}>{buttonText}</div>
    )
};
export default Button;