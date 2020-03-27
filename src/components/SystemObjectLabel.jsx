import React from 'react';
import util from './util.js';
import { FilePath } from './Filepath.js';

'use strict';

function SystemObjectLabel(props) {
    const labelClicked = () => {
        if (props.isHighlighted && !props.filepath.isPathToParent()) {
            props.setEditable(true);
        }
    }

    const submitRename = async (oldPath, newPath) => {
        const body = JSON.stringify({'oldPath': oldPath.toString(), 'newPath': newPath.toString()});

        try {
            await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, body);
            props.renamed(oldPath, newPath);
        } catch (error) {
            alert(error);
        }
    }

    const renameObject = async (newName) => {
        const oldPath = props.filepath;
        const newPath = new FilePath(props.filepath, newName);

        // check newPath doesn't already exist
        if (await util.confirmOverwrite(newPath)) {
            await submitRename(oldPath, newPath);
        }
    }

    const labelChanged = (event) => {
        props.setEditable(false);

        if (event.target.value !== props.filepath.file) {
            renameObject(event.target.value);
        }
    }

    return (props.editable ? 
            <input autoFocus type='text' className='editObjectLabel' defaultValue={props.filepath.file}
            onBlur={labelChanged}></input>
            :
            <div className="systemObjectLabel" onClick={labelClicked}>
                {props.filepath.file}
            </div>
    );
}

export default SystemObjectLabel;