const http = require("http");
const fs = require('fs');
const url = require('url');
const mime = require('mime');
const path = require('path');

const server = http.createServer((request, response) => {
    if (request.method === "POST") {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        });
        request.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            console.log(body.Directory);
            console.log(body.Filename);
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Data received.');
            response.end();
        });
    } else if (request.method === "GET") {
        let query = url.parse(request.url, true);
        let file = '.' + query.pathname;
        fs.readFile(file, (err, data) => {
            if (err) {
                response.writeHead(404, {'Content-Type': 'text/html'});
                response.write('Error 404: File Not Found');
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': mime.getType(path.extname(file))});
                response.write(data);
                response.end();
            }
        });
    } else {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write('Error 404: File Not Found');
        response.end();
    }
});

server.listen(8080);