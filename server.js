// This is the main server for drewwadsworth.com
// make constant variable here root of the website
// maybe want different constant variable root of dev.drewwadsworth.com
// otherwise, when we receive dev requests, just serve dev UI
// redirect drewwadsworth.com/dev to dev.drewwadsworth.com
// redirect http://drewwadsworth.com and http://dev.drewwadsworth.com to https with 308: permanent redirect

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const cdi = require('./client-dev-interface/client-dev-interface');

const devRoot = '/Users/drewwadsworth/Documents/Developer/dev_root';
const siteRoot = '/Users/drewwadsworth/Documents/Developer/site_root';
const systemRoot = '/Users/drewwadsworth/Documents/Developer';
const devURLRegex = /^\/client-dev-interface/;
const devSubDomRegex = /^dev./;

const server = http.createServer((request, response) => {
    const query = url.parse(request.url, true);

    // when we receive dev requests
    const root = devSubDomRegex.test(request.headers['host']) ? devRoot : siteRoot;

    // when we receive dev requests with url pathname = /client-dev-interface pass to client-dev-interface
    if (root === devRoot && devURLRegex.test(query.pathname)) { //maybe use node url fileurltopath instead?
        cdi.handle(request, response, systemRoot);
    } else if (request.method === 'GET' || request.method === 'HEAD') {
        // normal fileserver here
        let file = root + query.pathname;
        const dirPathRegex = /\/$/;     // file path ends in /
        if (dirPathRegex.test(file)) {
            file += 'index.html';
        }
        
        fs.readFile(file, (err, data) => {
            if (err) {
                response.writeHead(404, {'Content-Type': 'text/html'});
                if (request.method != 'HEAD') response.write('Error 404: File Not Found');
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': mime.getType(path.extname(file))});
                if (request.method != 'HEAD') response.write(data);
                response.end();
            }
        });
    } else {
        response.writeHead(405, {'Content-Type': 'text/html', 'Allow': 'GET, HEAD'});
        response.write('Error 405: Method Not Allowed');
        response.end();
    }
});

server.listen(8080);