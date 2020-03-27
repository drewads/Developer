import React from 'react';
import SystemObject from './SystemObject.jsx';
import EdNavButton from './EdNavButton.jsx';
import UploadButton from './UploadButton.jsx';
import util from './util.js';
import { DirPath, FilePath } from './Filepath.js';

'use strict';

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: new DirPath(), systemObjects: [], highlightedObject: null,
                        highlightedIsDir: false, dragged: null};
    }

    static sortSystemObjects = (systemObjects) => {
        const dirs = [];
        const files = [];

        for (const object of systemObjects) {
            object['isDir'] ? dirs.push(object) : files.push(object);
        }

        return dirs.concat(files);
    }

    static getDirContents = async (dirPath) => {
        try {
            const request = await util.makeCDIRequest('GET', `dir-snapshot?Directory=${dirPath.toString()}`,
                                                        {}, '');
            return Navigator.sortSystemObjects(JSON.parse(request.response));
        } catch (error) {
            throw error;
        }
    }

    componentDidMount = async () => {
        const path = this.state.path;
        try {
            const newSystemObjects = await Navigator.getDirContents(path);
            this.setState(state => {
                return (state.path.equals(path) ? { systemObjects: newSystemObjects } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    highlightObject = (object, isDir) => {
        this.setState({highlightedObject: object, highlightedIsDir: isDir});
    }

    unhighlightObject = (object) => {
        if (object.equals(this.state.highlightedObject)) {
            this.setState({highlightedObject: null, highlightedIsDir: false});
        }
    }

    navWindowClicked = () => {
        this.setState({highlightedObject: null, highlightedIsDir: false, dragged: null});
    }

    objectRenamed = async (oldPath, newPath) => {
        this.props.move(oldPath, newPath);
        const path = this.state.path;

        try {
            const newSystemObjects = await Navigator.getDirContents(path);
            this.setState(state => {
                return (state.path.equals(path) ? { systemObjects: newSystemObjects } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    moveToDirectory = async (dirPath) => {
        try {
            this.setState({path: dirPath,
                systemObjects: await Navigator.getDirContents(dirPath),
                highlightedObject: null, highlightedIsDir: false, dragged: null});
        } catch (error) {
            alert(error);
        }
    }

    objectDoubleClicked = async (object, isDir) => {
        if (isDir) {
            const path = this.state.path;
            path.moveTo(object.file);
            this.moveToDirectory(path);
        } else {
            this.props.edit(object);
        }
    }

    objectDragged = (object) => {
        this.setState(state => { return (object.equals(this.state.dragged) ? state : {dragged: object}); });
    }

    moveObject = async (oldPath, newPath, dirPath) => {
        const body = JSON.stringify({'oldPath': oldPath.toString(), 'newPath': newPath.toString()});
        
        try {
            await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, body);
            this.props.move(oldPath, newPath);
            const newSystemObjects = await Navigator.getDirContents(dirPath);
            this.setState(state => {
                return (state.path.equals(dirPath) ? { systemObjects: newSystemObjects } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    objectDropped = async (droppedOnto) => {
        if (!droppedOnto.equals(this.state.dragged)) {
            const path = this.state.path;
            const oldPath = new FilePath(path, this.state.dragged.file);
            const newPath = new FilePath(path, this.state.dragged.file);
            newPath.moveTo(droppedOnto.file);

            // check newPath doesn't already exist
            if (await util.confirmOverwrite(newPath)) {
                await this.moveObject(oldPath, newPath, path);
            }
        }
    }

    isInSystemObjects = (name) => {
        for (const object of this.state.systemObjects) {
            if (object['name'] === name) {
                return true;
            }
        }

        return false;
    }

    getFreeElemName = () => {
        const prefix = 'Untitled';
        let number = 0;
        
        while (this.isInSystemObjects(prefix + (number === 0 ? '' : number.toString()))) {
            number++;
        }

        return prefix + (number === 0 ? '' : number.toString());
    }

    createNewElement = async (isDir) => {
        const dirPath = this.state.path;
        const filepath = new FilePath(dirPath, this.getFreeElemName());
        const body = JSON.stringify({'Filepath' : filepath.toString(), 'isDirectory': isDir});

        try {
            await util.makeCDIRequest('PUT', 'create', {'Content-Type': 'application/json'}, body);
            const newSystemObjects = await Navigator.getDirContents(dirPath);
            this.setState(state => {
                return (state.path.equals(dirPath) ?
                        { systemObjects: newSystemObjects, highlightedObject: filepath,
                        highlightedIsDir: isDir } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    createFile = () => {
        this.createNewElement(false);
    }

    createDir = () => {
        this.createNewElement(true);
    }

    createFormData = async (dir, files) => {
        const uploadForm = new FormData();

        for (const file of files) {
            const filepath = new FilePath(dir, file.name);
            if (await util.confirmOverwrite(filepath)) {
                uploadForm.append(filepath.toString(), file);
            }
        }

        return uploadForm;
    }

    uploadFiles = async (files) => {
        const dir = this.state.path;
        const uploadForm = await this.createFormData(dir, files);

        try {
            await util.makeCDIRequest('PUT', 'upload', {}, uploadForm);
            const newSystemObjects = await Navigator.getDirContents(dir);
            this.setState(state => {
                return (state.path.equals(dir) ? { systemObjects: newSystemObjects} : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    deleteObject = async () => {
        if (this.state.highlightedObject === null || this.state.highlightedObject.isPathToParent()) return;

        const dirPath = this.state.path;
        const filepath = this.state.highlightedObject;
        const body = JSON.stringify({'Filepath': filepath.toString(),
                                    'isDirectory': this.state.highlightedIsDir});
        try {
            await util.makeCDIRequest('DELETE', 'delete', {'Content-Type': 'application/json'}, body);
          	this.props.delete(filepath);
            const newSystemObjects = await Navigator.getDirContents(dirPath);
            this.setState(state => {
                return (state.path.equals(dirPath) ?
                        { systemObjects: newSystemObjects, highlightedObject: null, highlightedIsDir: false }
                        : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    createSystemObject = (name, isDir) => {
        const filepath = new FilePath(this.state.path, name);
        return (
            <SystemObject key={filepath.toString()}
                            filepath={filepath}
                            isDir={isDir}
                            isHighlighted={filepath.equals(this.state.highlightedObject)}
                            doubleClick={this.objectDoubleClicked}
                            highlight={this.highlightObject}
                            renamed={this.objectRenamed}
                            unhighlight={this.unhighlightObject}
                            dragged={this.objectDragged}
                            dropped={this.objectDropped}/>
        );
    }

    fillViewer = (elements) => {
        const systemObjects = (this.state.path.length() !== 0 ?
                                [this.createSystemObject(DirPath.parentLabel, true)] : []);

        for (const element of elements) {
            systemObjects.push(this.createSystemObject(element['name'], element['isDir']));
        }

        return systemObjects;
    }

    render() {
        return (
            <div className='navigator'>
                <EdNavButton side='left' image='./icons/newFile.png' onClick={this.createFile}/>
                <EdNavButton side='left' image='./icons/newFolder.png' onClick={this.createDir}/>
                <UploadButton side='left' image='./icons/uploadIcon.png' onClick={this.uploadFiles}/>
                <EdNavButton side='right' image='./icons/deleteIcon.png' onClick={this.deleteObject}/>
                <div className="edNavPath">
                    {this.state.path.toString()}
                </div>
                <div className="navWrapper" onClick={this.navWindowClicked}>
                    <div className="navViewer">
                        {this.fillViewer(this.state.systemObjects)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigator;