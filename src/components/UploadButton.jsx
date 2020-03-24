import React from 'react';
import EdNavButton from './EdNavButton.jsx';

'use strict';

class UploadButton extends React.Component {
    constructor(props) {
        super(props);

        this.fileInput = React.createRef();
    }

    buttonClicked = () => {
        this.fileInput.current.click();
    }

    inputChanged = () => {
        this.props.onClick(this.fileInput.current.files);
    }

    render() {
        return (
            <div>
                <input multiple type='file' ref={this.fileInput} onChange={this.inputChanged} hidden/>
                <EdNavButton side={this.props.side} image={this.props.image} onClick={this.buttonClicked}/>
            </div>
        );
    }
}

export default UploadButton;