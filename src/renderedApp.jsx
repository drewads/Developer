import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './components/App.jsx';

export default ReactDOMServer.renderToString(
    <html>
        <head>
            <title>
                Developer
            </title>
            <link rel="stylesheet" href="./styles.css"></link>
            <link rel="stylesheet" href="./codemirror-5.52.2/lib/codemirror.css"></link>
            <script src="./codemirror-5.52.2/lib/codemirror.js"></script>
            <script src="./codemirror-5.52.2/mode/javascript/javascript.js"></script>
  			<script src="./codemirror-5.52.2/mode/jsx/jsx.js"></script>
            <script src="./codemirror-5.52.2/mode/css/css.js"></script>
            <script src="./codemirror-5.52.2/mode/xml/xml.js"></script>
            <script src="./codemirror-5.52.2/mode/htmlmixed/htmlmixed.js"></script>
        </head>
        <body>
            <div id='root'>
                <App />
            </div>
            <script src='main.js'></script>
        </body>
    </html>
);