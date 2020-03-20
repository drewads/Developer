import React from 'react';

function Header() {
    const logOut = () => {
        console.log('logging out.');
    }

    return (
        <div id='header'>
            <div id='logo'>
                Developer
            </div>
            <button  className='UIButton topButton logout' onClick={logOut}> logout </button>
        </div>
    );
}

export default Header;