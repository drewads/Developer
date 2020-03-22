import React from 'react';

class Editor extends React.Component {
    constructor(props) {
        super(props);
    }

    /*<button className='UIButton topButton save' title='Save changes made to file in editor'>
                    save
                </button>*/

    render() {
        return (
            <div className='editor'>
                <button className='edNavButtons rightEdNavButtons'>
                    <img src='./icons/saveIcon.png' className='edNavButtonsImg'></img>
                </button>
                <div className='edNavPath'>
                    {this.props.path}
                </div>
                    
                <textarea className='editorTextArea' spellCheck='false' defaultValue={this.props.value}></textarea>
            </div>
        );
    }
}

export default Editor;