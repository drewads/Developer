import React from 'react';

class SystemObject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {labelEditable: false};

        this.objectClicked = this.objectClicked.bind(this);
        this.labelClicked = this.labelClicked.bind(this);
        this.getLabel = this.getLabel.bind(this);
        this.labelChanged = this.labelChanged.bind(this);
        this.renameObject = this.renameObject.bind(this);
        this.objectDoubleClicked = this.objectDoubleClicked.bind(this);
    }

    // write an onclick for label
    // write an onclick for img potentially
    // write an ondoubleclick for the whole thing

    getIcon(isDir) {
        return ('./icons/' + (isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png'));
    }

    objectClicked(event) {
        event.stopPropagation();
        if (!this.props.highlighted) {
            this.props.click(this.props)
        }
    }

    objectDoubleClicked() {
        this.props.doubleClick(this.props.label, this.props.isDir);
    }

    labelClicked() {
        if (this.props.highlighted) {
            this.setState({labelEditable: true});
        }
    }

    renameObject(newName) {
        const request = new XMLHttpRequest();
        const DONE_STATE = 4;

        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                if (request.status === 200) {
                    this.props.renamed();
                } else {
                    alert(request.response);
                }
            }
        }

        request.open('PATCH', `${window.location.protocol}//${window.location.host}/client-dev-interface/move`);
        request.setRequestHeader('Content-Type', 'application/json');
        const body = {'oldPath': this.props.parentDir + this.props.label, 'newPath': this.props.parentDir + newName};
        request.send(JSON.stringify(body));
    }

    labelChanged(event) {
        this.setState({labelEditable: false});

        if (event.target.value !== this.props.label) {
            this.renameObject(event.target.value);
        }
    }

    getLabel(editable) {
        if (editable) {
            return (
                <input autoFocus type='text' className='editObjectLabel' defaultValue={this.props.label}
                    onBlur={this.labelChanged}></input>
            );
        } else {
            return (
                <div className="systemObjectLabel" onClick={this.labelClicked}>
                    {this.props.label}
                </div>
            );
        }
    }

    render () {
        return (
            <div className={'systemObject' + (this.props.highlighted ? ' highlightedSystemObject' : '')}
            onClick={this.objectClicked}>
                <img src={this.getIcon(this.props.isDir)} onDoubleClick={this.objectDoubleClicked}></img>
                {this.getLabel(this.state.labelEditable)}
            </div>
        );
    }
}

export default SystemObject;