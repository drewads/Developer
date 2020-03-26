import React from 'react';
import util from './util.js';

'use strict';

function SystemObjectLabel(props) {
    const labelClicked = () => {
        if (props.isHighlighted && !props.isPathToParent) {
            props.setEditable(true);
        }
    }

    const submitRename = async (oldPath, newPath) => {
        const body = {'oldPath': oldPath, 'newPath': newPath};

        try {
            await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, JSON.stringify(body));
            props.renamed(oldPath, newPath);
        } catch (error) {
            alert(error);
        }
    }

    const renameObject = async (newName) => {
        const oldPath = props.parentDir + props.label;
        const newPath = props.parentDir + newName;

        // check newPath doesn't already exist
        try {
            await util.makeCDIRequest('GET', `exists?Filepath=${newPath}`, {}, {});
            if (window.confirm(`The file ${newPath} already exists. Would you like to replace it?`)) {
                await submitRename(oldPath, newPath);
            }
        } catch (error) {
            if (error === 'filesystem entry does not exist') {
                await submitRename(oldPath, newPath);
            } else alert(error);
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