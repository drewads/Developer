import React from 'react';
import ParentDir from './ParentDir';
import SystemObject from './SystemObject';

class NavigatorObject extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className={'navObject' + (this.props.highlighted ? ' highlightedNavObject' : '')}
                onClick={this.objectClicked}>
                <img src={this.getIcon(this.props.isDir)} onDoubleClick={this.objectDoubleClicked}></img>
                {this.getLabel(this.state.labelEditable)}
            </div>
        );
    }
}

export default NavigatorObject;