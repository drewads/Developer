import React from 'react';

function SystemObject(props) {
    // write an onclick for label
    // write an onclick for img potentially
    // write an ondoubleclick for the whole thing
    const icon = './icons/' + (props.isDir ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png');

    return (
        <div className="systemObject">
            <img src={icon}></img>
            <div className="systemObjectLabel">
                {props.label}
            </div>
        </div>
    );
}

class Navigator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='navigator'>
                <img src='./icons/newFile.png' className='navButtons'></img>
                <div className="navigatorPath">
                    {this.props.path}
                </div>
                <div className="navWrapper">
                    <div className="navViewer">
                        <SystemObject label='subsub' isDir={true} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigator;