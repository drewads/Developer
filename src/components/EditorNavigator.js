import React from 'react';
import Editor from './Editor';
import Navigator from './Navigator';

class EditorNavigator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Editor path='/main/sub/subsub/file.html' value=''/>
                <Navigator path='/main/sub/subsub'/>
            </div>
        );
    }
}

export default EditorNavigator;