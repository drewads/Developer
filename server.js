import express from 'express';
import cdi from 'client-dev-interface';
import renderedApp from './src/renderedApp';
import http from 'http';

const server = express();
const PORT = 8080;

const devURLRegex = /^\/client-dev-interface/;
const devSubDomRegex = /^dev\./;
const acceptedMethods = ['GET'];

http.createServer(server).listen(PORT, () => {console.log(`server listening on port ${PORT}`)});

server.use((req, res, next) => {
    if (devSubDomRegex.test(req.get('host'))) {
        next();
    } else {
        // this will eventually change to forward
        res.status(404);
        res.send('Error 404: File Not Found');
    }
});

server.use(express.static('dist'));

server.all(devURLRegex, async (req, res) => {
    try {
        const success = await cdi.handle(req, __dirname, __dirname + '/tmp_dir');
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