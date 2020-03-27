import React from 'react';
import SystemObjectLabel from './SystemObjectLabel.jsx';

'use strict';

class SystemObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {labelEditable: false};
    }

    static getIcon = (isDir) => {
        return ('./icons/' + (isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png'));
    }

    objectClicked = (event) => {
        event.stopPropagation();

        if (!this.props.isHighlighted) {
            this.props.highlight(this.props.filepath, this.props.isDir);
        }
    }

    objectDoubleClicked = () => {
        this.props.doubleClick(this.props.filepath, this.props.isDir);
    }

    setEditable = (isEditable) => {
        this.setState({labelEditable: isEditable});
    }

    dragHandler = () => {
        this.props.dragged(this.props.filepath);
    }

    dragEnter = (event) => {
        event.preventDefault();

        if (this.props.isDir) {
            this.props.highlight(this.props.filepath, this.props.isDir);
        }
    }

    dragLeave = (event) => {
        event.preventDefault();

        this.props.unhighlight(this.props.filepath);
    }

    dragOver = (event) => {
        event.preventDefault();
    }

    dropHandler = (event) => {
        event.preventDefault();

        if (this.props.isDir) {
            this.props.dropped(this.props.filepath);
        }
    }

    render() {
        return (
            <div className={'systemObject' + (this.props.isHighlighted ? ' highlightedSystemObject' : '')}
                onClick={this.objectClicked} draggable={!this.state.labelEditable} onDragStart={this.dragHandler}>
                <img src={SystemObject.getIcon(this.props.isDir)} onDoubleClick={this.objectDoubleClicked}
                    draggable={false} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave}
                    onDrop={this.dropHandler} onDragOver={this.dragOver}></img>
                <SystemObjectLabel filepath={this.props.filepath} isHighlighted={this.props.isHighlighted}
                                    editable={this.state.labelEditable} setEditable={this.setEditable}
                                    renamed={this.props.renamed}/>
            </div>
        );
    }
}

export default SystemObject;