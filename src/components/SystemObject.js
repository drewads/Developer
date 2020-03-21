import React from 'react';

class SystemObject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {labelEditable: false};

        this.objectClicked = this.objectClicked.bind(this);
        this.labelClicked = this.labelClicked.bind(this);
        this.getLabel = this.getLabel.bind(this);
        this.labelChanged = this.labelChanged.bind(this);
    }

    static getDerivedStateFromProps(newProps, prevState) {
        return (prevState.labelEditable && !newProps.highlighted ? {labelEditable: false} : null);
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

    labelClicked() {
        if (this.props.highlighted) {
            this.setState({labelEditable: true});
        }
    }

    labelChanged(event) {
        this.setState({labelEditable: false});
        // http request with move
        // then if successful call this.props.renamed
        console.log(event.target.value);
    }

    getLabel(editable) {
        if (editable) {
            return (
                <input type='text' className='editObjectLabel' defaultValue={this.props.label}
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
                <img src={this.getIcon(this.props.isDir)}></img>
                {this.getLabel(this.state.labelEditable)}
            </div>
        );
    }
}

export default SystemObject;