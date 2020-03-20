import React from 'react';
import Editor from './Editor';
import Navigator from './Navigator';

class EditorNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='edNav'>
                <Editor path='/main/sub/subsub/file.html' value=''/>
                <Navigator />
            </div>
        );
    }
}

export default EditorNavigator;