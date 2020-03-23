import React from 'react';
import EdNavButton from './EdNavButton';

'use strict';

class Editor extends React.Component {
    constructor(props) {
        super(props);
    }

    /*<button className='UIButton topButton save' title='Save changes made to file in editor'>
                    save
                </button>*/
    saveFile = () => {
        alert('save');
    }

    render() {
        return (
            <div className='editor'>
                <EdNavButton side='right' image='./icons/saveIcon.png' onClick={this.saveFile}/>
                <div className='edNavPath'>
                    {this.props.path}
                </div>
                    
                <textarea className='editorTextArea' spellCheck='false' defaultValue={this.props.value}></textarea>
            </div>
        );
    }
}

export default Editor;