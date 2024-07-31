import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div>
            <div className="header">
                <h1>Manga King</h1>
                <a href="home" className="myButton">Home</a>
            </div>
            <hr className="separator" />
        </div>
    );
}

export default Header;
