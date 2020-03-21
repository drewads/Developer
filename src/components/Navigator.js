import React from 'react';
import SystemObject from './SystemObject';

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: '/', systemObjects: [], highlightedObject: null};

        this.objectClicked = this.objectClicked.bind(this);
        this.navWindowClicked = this.navWindowClicked.bind(this);
    }

    sortSystemObjects(systemObjects) {
        const dirs = [];
        const files = [];

        for (const object of systemObjects) {
            object['isDir'] ? dirs.push(object) : files.push(object);
        }

        return dirs.concat(files);
    }

    getDirContents(dirPath) {
            const request = new XMLHttpRequest();
            const DONE_STATE = 4;

            request.onreadystatechange = () => {
                if (request.readyState === DONE_STATE) {
                    if (request.status === 200) {
                        this.setState({path: '/', systemObjects: this.sortSystemObjects(JSON.parse(request.response))});
                    } else {
                        alert(request.response);
                    }
                }
            }

            request.open('GET', 'http://dev.localhost:8080/client-dev-interface/dir-snapshot?Directory=' + dirPath);

            request.send();
    }

    componentDidMount() {
        this.getDirContents(this.state.path);
    }

    objectClicked(objProps) {
        this.setState({highlightedObject: objProps.label});
    }

    navWindowClicked() {
        this.setState({highlightedObject: null});
    }

    objectRenamed() {
        this.getDirContents(this.state.path);
    }

    fillViewer(elements) {
        const systemObjects = [];

        for (const element of elements) {
            systemObjects.push(<SystemObject key={this.state.path + element['name']}
                                    label={element['name']} isDir={element['isDir']}
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
                    {this.state.path}
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