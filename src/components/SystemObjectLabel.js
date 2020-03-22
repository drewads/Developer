import React from 'react';
import util from './util';

class SystemObjectLabel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {editable: false};
    }
    
    labelClicked = () => {
        if (this.props.isHighlighted && !this.props.isPathToParent) {
            this.setState({editable: true});
        }
    }

    renameObject = async (newName) => {
        const body = {'oldPath': this.props.parentDir + this.props.label, 'newPath': this.props.parentDir + newName};

        try {
            await util.makeCDIRequest('PATCH', 'move', {'Content-Type': 'application/json'}, JSON.stringify(body));
            this.props.renamed();
        } catch (error) {
            alert(error);
        }
    }

    labelChanged = (event) => {
        this.setState({editable: false});

        if (event.target.value !== this.props.label) {
            this.renameObject(event.target.value);
        }
    }

    render() {
        return (this.state.editable ? 
                <input autoFocus type='text' className='editObjectLabel' defaultValue={this.props.label}
                onBlur={this.labelChanged}></input>
                :
                <div className="systemObjectLabel" onClick={this.labelClicked}>
                    {this.props.label}
                </div>
                );
    }
}

export default SystemObjectLabel;