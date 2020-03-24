import express from 'express';
import cdi from 'client-dev-interface';
import http from 'http';
import path from 'path';
import renderedApp from './src/renderedApp.jsx';

const server = express();
const PORT = 8080;

const devURLRegex = /^\/client-dev-interface/;
const devSubDomRegex = /^dev\./;
const acceptedMethods = ['GET'];

http.createServer(server).listen(PORT, () => {
    console.log(`\x1b[36m[Developer] server listening on port ${PORT}\x1b[0m`)
});

server.use((req, res, next) => {
    if (devSubDomRegex.test(req.get('host'))) {
        next();
    } else {
        // this will eventually change to forward
        res.status(404);
        res.send('Error 404: File Not Found');
    }
});

server.all(devURLRegex, async (req, res) => {
    try {
        const success = await cdi.handle(req, __dirname, path.join(__dirname, 'tmp_dir'));
        res.status(success.statusCode);
        res.header(success.responseHeaders);
        res.send(success.body);
    } catch (error) {
        res.status(error.statusCode);
        res.header(error.responseHeaders);
        res.send(error.message);
    }
});

server.get('/', (req, res) => {
    res.send(renderedApp);
});

server.use(express.static(path.join(__dirname, 'dist')));
server.use(express.static(path.join(__dirname, 'node_modules')));

const commaDelimStr = (strArray) => {
    if (strArray.length === 0) {
        return '';
    }

    let result = strArray[0];

    const minusFirst = strArray.slice(1);
    for (const elem of minusFirst) {
        result += ', ' + elem;
    }

    return result;
}

server.use((req, res) => {
    if (acceptedMethods.includes(req.method)) {
        res.status(404);
        res.send('Error 404: File Not Found');
    } else {
        res.status(405);
        res.header('Allow', commaDelimStr(acceptedMethods));
        res.send('Error 405: Method Not Allowed');
    }
});