import React from 'react';
import SystemObject from './SystemObject';
import util from './util';

const parentLabel = '..';

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: [], systemObjects: [], highlightedObject: null, dragged: null};
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
            const response = await util.makeCDIRequest('GET', `dir-snapshot?Directory=${dirPath}`, {}, '');
            return Navigator.sortSystemObjects(JSON.parse(response));
        } catch (error) {
            throw error;
        }
    }

    componentDidMount = async () => {
        try {
            this.setState({systemObjects: await Navigator.getDirContents(Navigator.getPath(this.state.path))});
        } catch (error) {
            alert(error);
        }
    }

    highlightObject = (objectName) => {
        this.setState({highlightedObject: objectName});
    }

    unhighlightObject = (objectName) => {
        if (objectName === this.state.highlightedObject) {
            this.setState({highlightedObject: null});
        }
    }

    navWindowClicked = () => {
        this.setState({highlightedObject: null, dragged: null});
    }

    objectRenamed = async () => {
        try {
            this.setState({systemObjects: await Navigator.getDirContents(Navigator.getPath(this.state.path))});
        } catch (error) {
            alert(error);
        }
    }

    moveToDirectory = async (pathArray) => {
        try {
            this.setState({path: pathArray,
                systemObjects: await Navigator.getDirContents(Navigator.getPath(pathArray)),
                highlightedObject: null, dragged: null});
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
        }
    }

    objectDragged = (objectName) => {
        if (this.state.dragged !== objectName) {
            this.setState({dragged: objectName});
        }
    }

    objectDropped = (droppedOnto) => {
        if (this.state.dragged !== droppedOnto) {
            console.log(this.state.dragged + ' dropped onto ' + droppedOnto);
            // move
            // getDir
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

    // need navButton component

    render() {
        return (
            <div className='navigator'>
                <button className='edNavButtons leftEdNavButtons'>
                    <img src='./icons/newFile.png' className='edNavButtonsImg'></img>
                </button>
                <button className='edNavButtons leftEdNavButtons'>
                    <img src='./icons/newFolder.png' className='edNavButtonsImg'></img>
                </button>
                <button className='edNavButtons leftEdNavButtons'>
                    <img src='./icons/uploadIcon.png' className='edNavButtonsImg'></img>
                </button>
                <button className='edNavButtons rightEdNavButtons'>
                    <img src='./icons/deleteIcon.png' className='edNavButtonsImg'></img>
                </button>
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