import React from 'react';
import EdNavButton from './EdNavButton.jsx';
import util from './util.js';

'use strict';

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.editorWrapper = React.createRef();
    }

    saveFile = async () => {
        if (this.props.path === null) {
            return;
        }

        try {
            await util.makeCDIRequest('PUT', `save?Filepath=${this.props.path}`,
                                        {'Content-Type': this.props.mimeType}, this.editor.getValue());
            this.props.saved();
        } catch (error) {
            alert(error);
        }
    }

    changeHandler = () => {
        if (this.stifleChange) {
            this.stifleChange = false;
        } else {
            this.props.edited();
        }
    }

    componentDidMount = () => {
        this.editor = CodeMirror(this.editorWrapper.current, {
            lineNumbers: true,
            tabSize: 4
        });
        
        this.editor.setSize('100%', '100%');
        this.editor.on('change', this.changeHandler);
    }

    render() {
        if (this.props.isNew) {
            this.stifleChange = true;
            this.editor.setValue(this.props.defaultValue);
            this.editor.setOption('mode', (this.props.mimeType ? util.getMediaType(this.props.mimeType)
                                                                : 'text/plain'));
        }
        return (
            <div className='editor'>
                <EdNavButton side='right' image='./icons/saveIcon.png' onClick={this.saveFile}/>
                <div className='edNavPath'>
                    {this.props.path}
                </div>
                    
                <div id='textarea' className='editorWrapper' ref={this.editorWrapper}></div>
            </div>
        );
    }
}

export default Editor;