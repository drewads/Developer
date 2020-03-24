import React from 'react';
import util from './util.js';

'use strict';

function SystemObjectLabel(props) {
    const labelClicked = () => {
        if (props.isHighlighted && !props.isPathToParent) {
            props.setEditable(true);
        }
    }

    const renameObject = async (newName) => {
        const oldPath = props.parentDir + props.label;
        const newPath = props.parentDir + newName;
        const body = {'oldPath': oldPath, 'newPath': newPath};

        try {
            await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, JSON.stringify(body));
            props.renamed(oldPath, newPath);
        } catch (error) {
            alert(error);
        }
    }

    const labelChanged = (event) => {
        props.setEditable(false);

        if (event.target.value !== props.label) {
            renameObject(event.target.value);
        }
    }

    return (props.editable ? 
                <input autoFocus type='text' className='editObjectLabel' defaultValue={props.label}
                onBlur={labelChanged}></input>
                :
                <div className="systemObjectLabel" onClick={labelClicked}>
                    {props.label}
                </div>
            );
}

export default SystemObjectLabel;