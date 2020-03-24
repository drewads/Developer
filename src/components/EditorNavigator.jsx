import React from 'react';
import Editor from './Editor.jsx';
import Navigator from './Navigator.jsx';
import util from './util.js';

'use strict';

class EditorNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: null, mimeType: null, defaultValue: '', edited: false, isNew: false};
    }

    editFile = async (filepath) => {
        try {
            const request = await util.makeCDIRequest('GET', `edit?Filepath=${filepath}`, {}, '');
            const newState = {file: filepath, mimeType: request.getResponseHeader('Content-Type'),
                                defaultValue: request.response, edited: false, isNew: true};
            
            if (this.state.edited) {
                const change = window.confirm(`The file ${this.state.file} has unsaved changes.\n`
                                                + `Would you like to discard changes?`);
                if (change) {
                    this.setState(newState);
                }
            } else {
                this.setState(newState);
            }
        } catch (error) {
            alert(error);
        }
    }
    
    deleteFile = (filepath) => {
      	this.setState(state => {
        	return (filepath === state.file ?
                    {file: null, mimeType: null, defaultValue: '', edited: false, isNew: true}
                    : state);
        });
    }

    fileEdited = () => {
        this.setState({edited: true, isNew: false});
    }

    fileSaved = () => {
        this.setState({edited: false, isNew: false});
    }

    render() {
        return (
            <div className='edNav'>
                <Editor path={this.state.file} mimeType={this.state.mimeType}
                        defaultValue={this.state.defaultValue} edited={this.fileEdited}
                        saved={this.fileSaved} isNew={this.state.isNew}/>
                <Navigator edit={this.editFile} delete={this.deleteFile}/>
            </div>
        );
    }
}

export default EditorNavigator;