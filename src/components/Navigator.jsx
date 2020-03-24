import React from 'react';
import SystemObject from './SystemObject.jsx';
import EdNavButton from './EdNavButton.jsx';
import UploadButton from './UploadButton.jsx';
import util from './util.js';

'use strict';

const parentLabel = '..';

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: [], systemObjects: [], highlightedObject: null, highlightedIsDir: false,
                        dragged: null};
    }

    static getPath = (pathArray) => {
        let path = '/';

        for (const dir of pathArray) {
            path += dir + '/';
        }

        return path;
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
            const request = await util.makeCDIRequest('GET', `dir-snapshot?Directory=${dirPath}`, {}, '');
            return Navigator.sortSystemObjects(JSON.parse(request.response));
        } catch (error) {
            throw error;
        }
    }

    componentDidMount = async () => {
        const path = Navigator.getPath(this.state.path);
        try {
            const newSystemObjects = await Navigator.getDirContents(path);
            this.setState(state => {
                return (Navigator.getPath(state.path) === path ? { systemObjects: newSystemObjects } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    highlightObject = (objectName, isDir) => {
        this.setState({highlightedObject: objectName, highlightedIsDir: isDir});
    }

    unhighlightObject = (objectName) => {
        if (objectName === this.state.highlightedObject) {
            this.setState({highlightedObject: null, highlightedIsDir: false});
        }
    }

    navWindowClicked = () => {
        this.setState({highlightedObject: null, highlightedIsDir: false, dragged: null});
    }

    objectRenamed = async () => {
        const path = Navigator.getPath(this.state.path);

        try {
            const newSystemObjects = await Navigator.getDirContents(path);
            this.setState(state => {
                return (Navigator.getPath(state.path) === path ? { systemObjects: newSystemObjects } : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    moveToDirectory = async (pathArray) => {
        try {
            this.setState({path: pathArray,
                systemObjects: await Navigator.getDirContents(Navigator.getPath(pathArray)),
                highlightedObject: null, highlightedIsDir: false, dragged: null});
        } catch (error) {
            alert(error);
        }
    }

    objectDoubleClicked = async (objectName, isDir) => {
        if (objectName === parentLabel) {
            this.moveToDirectory(this.state.path.slice(0, -1));
        }
        else if (isDir) {
            this.moveToDirectory(this.state.path.concat(objectName));
        } else {
            this.props.edit(Navigator.getPath(this.state.path) + objectName);
        }
    }

    objectDragged = (objectName) => {
        if (this.state.dragged !== objectName) {
            this.setState({dragged: objectName});
        }
    }

    objectDropped = async (droppedOnto) => {
        if (this.state.dragged !== droppedOnto) {
            const oldPath = Navigator.getPath(this.state.path) + this.state.dragged;
            const newPath = Navigator.getPath(this.state.dragged === parentLabel ?
                                                this.state.path.slice(0, -1)
                                                : this.state.path.concat(droppedOnto))
                                                + this.state.dragged;
            const body = JSON.stringify({'oldPath': oldPath, 'newPath': newPath});

            const path = Navigator.getPath(this.state.path);
            try {
                await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, body);
                const newSystemObjects = await Navigator.getDirContents(path);
                this.setState(state => {
                    return (Navigator.getPath(state.path) === path ? { systemObjects: newSystemObjects } : state);
                });
            } catch (error) {
                alert(error);
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

    createNewElement = async (isDir) => {
        const prefix = 'Untitled';
        let number = 0;
        
        while (this.isInSystemObjects(prefix + (number === 0 ? '' : number.toString()))) {
            number++;
        }
        const name = prefix + (number === 0 ? '' : number.toString())

        const filepath = Navigator.getPath(this.state.path) + name;
        const body = JSON.stringify({'Filepath' : filepath, 'isDirectory': isDir});

        const path = Navigator.getPath(this.state.path);
        try {
            await util.makeCDIRequest('PUT', 'create', {'Content-Type': 'application/json'}, body);
            const newSystemObjects = await Navigator.getDirContents(path);
            this.setState(state => {
                return (Navigator.getPath(state.path) === path ?
                        { systemObjects: newSystemObjects, highlightedObject: name, highlightedIsDir: isDir }
                        : state);
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

    uploadFiles = async (files) => {
        const uploadForm = new FormData();
        const dir = Navigator.getPath(this.state.path);

        for (const file of files) {
            uploadForm.append(dir + file.name, file);
        }

        try {
            await util.makeCDIRequest('PUT', 'upload', {}, uploadForm);
            const newSystemObjects = await Navigator.getDirContents(dir);
            this.setState(state => {
                return (Navigator.getPath(state.path) === dir ? { systemObjects: newSystemObjects} : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    deleteObject = async () => {
        if (this.state.highlightedObject === null || this.state.highlightedObject === parentLabel) return;

      	const name = this.state.highlightedObject;
      	const dirPath = Navigator.getPath(this.state.path);
        const body = JSON.stringify({'Filepath': dirPath + name,
                                    'isDirectory': this.state.highlightedIsDir});
        
        try {
            await util.makeCDIRequest('DELETE', 'delete', {'Content-Type': 'application/json'}, body);
          	this.props.delete(dirPath + name);
            const newSystemObjects = await Navigator.getDirContents(dirPath);
            this.setState(state => {
                return (Navigator.getPath(state.path) === dirPath ?
                        { systemObjects: newSystemObjects, highlightedObject: null, highlightedIsDir: false }
                        : state);
            });
        } catch (error) {
            alert(error);
        }
    }

    createSystemObject = (name, isDir) => {
        return (
            <SystemObject key={Navigator.getPath(this.state.path) + name}
                            label={name}
                            isDir={isDir}
                            isPathToParent={name === parentLabel}
                            isHighlighted={name === this.state.highlightedObject}
                            parentDir={Navigator.getPath(this.state.path)}
                            doubleClick={this.objectDoubleClicked}
                            highlight={this.highlightObject}
                            renamed={this.objectRenamed}
                            unhighlight={this.unhighlightObject}
                            dragged={this.objectDragged}
                            dropped={this.objectDropped}/>
        );
    }

    fillViewer = (elements) => {
        const systemObjects = (this.state.path.length !== 0 ? [this.createSystemObject(parentLabel, true)] : []);

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
                    {Navigator.getPath(this.state.path)}
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