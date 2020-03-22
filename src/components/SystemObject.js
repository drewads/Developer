import React from 'react';
import SystemObjectLabel from './SystemObjectLabel';

function SystemObject(props) {
    const getIcon = (isDir) => {
        return ('./icons/' + (isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png'));
    }

    const objectClicked = (event) => {
        event.stopPropagation();

        if (!props.isHighlighted) {
            props.highlight(props.label);
        }
    }

    const objectDoubleClicked = () => {
        props.doubleClick(props.label, props.isDir);
    }

    const dragHandler = () => {
        props.dragged(props.label);
    }

    const dragEnter = (event) => {
        event.preventDefault();

        if (props.isDir) {
            props.highlight(props.label);
        }
    }

    const dragLeave = (event) => {
        event.preventDefault();

        props.unhighlight(props.label);
    }

    const dragOver = (event) => {
        event.preventDefault();
    }

    const dropHandler = (event) => {
        event.preventDefault();

        if (props.isDir) {
            props.dropped(props.label);
        }
    }

    return (
        <div className={'systemObject' + (props.isHighlighted ? ' highlightedSystemObject' : '')}
            onClick={objectClicked} draggable={true} onDragStart={dragHandler}>
            <img src={getIcon(props.isDir)} onDoubleClick={objectDoubleClicked} draggable={false}
                onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={dropHandler}
                onDragOver={dragOver}></img>
            <SystemObjectLabel label={props.label} isHighlighted={props.isHighlighted}
                                parentDir={props.parentDir} renamed={props.renamed}
                                isPathToParent={props.isPathToParent}/>
        </div>
    );
}

export default SystemObject;