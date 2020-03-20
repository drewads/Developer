import React from 'react';

class Editor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='editor'>
                <button className='UIButton topButton save' title='Save changes made to file in editor'>
                    save
                </button>
                <div className='editorPath'>
                    {this.props.path}
                </div>
                    
                <textarea className='editorTextArea' spellCheck='false' defaultValue={this.props.value}></textarea>
            </div>
        );
    }
}

export default Editor;