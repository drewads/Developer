import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/App';

export default ReactDOMServer.renderToString(
    <html>
        <head>
            <title>
                Developer
            </title>
        </head>
        <body>
            <div id='root'>
                <App />
            </div>
            <script src='main.js'></script>
        </body>
    </html>
);