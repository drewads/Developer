import React from 'react';
import SystemObjectLabel from './SystemObjectLabel';

function SystemObject(props) {
    const getIcon = (isDir) => {
        return ('./icons/' + (isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png'));
    }

    const objectClicked = (event) => {
        event.stopPropagation();
        if (!props.isHighlighted) {
            props.click(props);
        }
    }

    const objectDoubleClicked = () => {
        props.doubleClick(props.label, props.isDir);
    }

    return (
        <div className={'systemObject' + (props.isHighlighted ? ' highlightedSystemObject' : '')}
            onClick={objectClicked}>
            <img src={getIcon(props.isDir)} onDoubleClick={objectDoubleClicked}></img>
            <SystemObjectLabel label={props.label} isHighlighted={props.isHighlighted}
                                parentDir={props.parentDir} renamed={props.renamed}
                                isPathToParent={props.isPathToParent}/>
        </div>
    );
}

export default SystemObject;