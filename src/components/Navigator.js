import React from 'react';
import SystemObject from './SystemObject';

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: [], systemObjects: [], highlightedObject: null};
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

    static getDirContents = (dirPath) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            const DONE_STATE = 4;

            request.onreadystatechange = () => {
                if (request.readyState === DONE_STATE) {
                    if (request.status === 200) {
                        resolve(Navigator.sortSystemObjects(JSON.parse(request.response)));
                    } else {
                        reject(request.response);
                    }
                }
            }

            request.open('GET', `${window.location.protocol}//${window.location.host}/client-dev-interface/dir-snapshot?Directory=${dirPath}`);
            request.send();
        });
    }

    componentDidMount = async () => {
        try {
            this.setState({systemObjects: await Navigator.getDirContents(Navigator.getPath(this.state.path))});
        } catch (error) {
            alert(error);
        }
    }

    objectClicked = (objProps) => {
        this.setState({highlightedObject: objProps.label});
    }

    navWindowClicked = () => {
        this.setState({highlightedObject: null});
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
                highlightedObject: null});
        } catch (error) {
            alert(error);
        }
    }

    objectDoubleClicked = async (objectName, isDir) => {
        if (objectName === '..') {
            this.moveToDirectory(this.state.path.slice(0, -1));
        }
        else if (isDir) {
            this.moveToDirectory(this.state.path.concat(objectName));
        }
    }

    // this must change with a change to systemobject
    fillViewer = (elements) => {
        const systemObjects = (this.state.path.length !== 0 ? [<SystemObject key={Navigator.getPath(this.state.path) + '..'}
                                label={'..'} isDir={true}
                                parentDir={Navigator.getPath(this.state.path)}
                                doubleClick={this.objectDoubleClicked}
                                highlighted={'..' === this.state.highlightedObject}
                                click={this.objectClicked} renamed={this.objectRenamed}/>] : []);

        for (const element of elements) {
            systemObjects.push(<SystemObject key={Navigator.getPath(this.state.path) + element['name']}
                                    label={element['name']} isDir={element['isDir']}
                                    parentDir={Navigator.getPath(this.state.path)}
                                    doubleClick={this.objectDoubleClicked}
                                    highlighted={element['name'] === this.state.highlightedObject}
                                    click={this.objectClicked} renamed={this.objectRenamed}/>);
        }

        return systemObjects;
    }

    render() {
        return (
            <div className='navigator'>
                <img src='./icons/newFile.png' className='navButtons'></img>
                <div className="navigatorPath">
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