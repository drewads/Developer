import React from 'react';
import Editor from './Editor.jsx';
import Navigator from './Navigator.jsx';
import util from './util.js';
import { FilePath } from './Filepath.js';

'use strict';

class EditorNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: null, mimeType: null, defaultValue: '', edited: false, isNew: false};
    }

    stateForNewFile = async (filepath) => {
        try {
            const request = await util.makeCDIRequest('GET', `edit?Filepath=${filepath.toString()}`, {}, '');
            return {file: filepath, mimeType: request.getResponseHeader('Content-Type'),
                    defaultValue: request.response, edited: false, isNew: true};
        } catch (error) {
            throw error;
        }
    }

    editFile = async (filepath) => {
        try {
            const newState = await this.stateForNewFile(filepath);
            
            if (this.state.edited) {
                const change = window.confirm(`The file ${this.state.file.toString()} has unsaved changes.\n`
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

    moveFile = async (oldPath, newPath) => {
        if (oldPath.equals(this.state.file)) {
            this.setState({file: newPath, isNew: false});
        } else if (newPath.equals(this.state.file)) {   // is current file destination for move? - if yes, isNew: true
            try {
                this.setState(await this.stateForNewFile(newPath));
            } catch (error) {
                alert(error);
            }
        } else if (oldPath.isAncestorOf(this.state.file)) { // does the path to current file change bc rename of ancestor directory?
            this.state.file.substitutePrefix(oldPath, newPath);
            this.setState(state => ({file: state.file, isNew: false}));
        }
    }
    
    deleteFile = (filepath) => {
      	this.setState(state => {
        	return (filepath.equals(state.file) ?
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
                        defaultValue={this.state.defaultValue} unsaved={this.state.edited}
                        edited={this.fileEdited} saved={this.fileSaved} isNew={this.state.isNew}/>
                <Navigator edit={this.editFile} move={this.moveFile} delete={this.deleteFile}/>
            </div>
        );
    }
}

export default EditorNavigator;