import React from 'react';

'use strict';

function EdNavButton(props) {
    return (
        <button className={`edNavButtons ${props.side}EdNavButtons`} onClick={props.onClick}>
            <img src={props.image} className='edNavButtonsImg'></img>
        </button>
    );
}

export default EdNavButton;