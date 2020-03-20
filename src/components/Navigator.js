import React from 'react';

class SystemObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {highlighted: false};

        this.highlightObject = this.highlightObject.bind(this);
    }

    // write an onclick for label
    // write an onclick for img potentially
    // write an ondoubleclick for the whole thing

    getIcon(isDir) {
        return ('./icons/' + (isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png'));
    }

    highlightObject() {
        this.setState({highlighted: true});
    }

    render () {
        return (
            <div className={'systemObject' + (this.state.highlighted ? ' highlightedSystemObject' : '')}
            onClick={this.highlightObject}>
                <img src={this.getIcon(this.props.isDir)}></img>
                <div className="systemObjectLabel">
                    {this.props.label}
                </div>
            </div>
        );
    }
}

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {path: '/', systemObjects: [], highlightedObject: null};
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

    fillViewer(elements) {
        const systemObjects = [];

        for (const element of elements) {
            systemObjects.push(<SystemObject key={element['name']} label={element['name']} isDir={element['isDir']}/>);
        }

        return systemObjects;
    }

    componentDidMount() {
        this.getDirContents(this.state.path);
    }

    render() {
        return (
            <div className='navigator'>
                <img src='./icons/newFile.png' className='navButtons'></img>
                <div className="navigatorPath">
                    {this.state.path}
                </div>
                <div className="navWrapper">
                    <div className="navViewer">
                        {this.fillViewer(this.state.systemObjects)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigator;