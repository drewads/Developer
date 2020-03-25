import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/App.jsx';

export default ReactDOMServer.renderToString(
    <html>
        <head>
            <title>
                Developer
            </title>
          	<link rel="icon" type="image/png" href="icons/DevFavicon.png" sizes="64x64"></link>
            <link rel="stylesheet" href="./styles.css"></link>
            <link rel="stylesheet" href="codemirror/lib/codemirror.css"></link>
            <link rel="stylesheet" href="codemirror/theme/monokai.css"></link>
            <script src="codemirror/lib/codemirror.js"></script>
            <script src="codemirror/mode/javascript/javascript.js"></script>
  			<script src="codemirror/mode/jsx/jsx.js"></script>
            <script src="codemirror/mode/css/css.js"></script>
            <script src="codemirror/mode/xml/xml.js"></script>
            <script src="codemirror/mode/htmlmixed/htmlmixed.js"></script>
        </head>
        <body>
            <div id='root'>
                <App />
            </div>
            <script src='main.js'></script>
        </body>
    </html>
);