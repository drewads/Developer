const http = require("http");
const fs = require('fs');
const url = require('url');
const mime = require('mime');
const path = require('path');
const formidable = require('formidable');

const server = http.createServer((request, response) => {
    if (request.method === "PUT") {
        const form = new formidable.IncomingForm({ multiples: true, uploadDir: '/Users/drewwadsworth/documents/Developer/dev_root/test'});
        const parsed = new Promise((resolve, reject) => {
            form.parse(request, function(err, fields, files) {
                err ? reject(err) : resolve({fields : fields, files : files});
            });
        });

        parsed.then((args) => {
            const filepaths = Object.keys(args.files);
            //console.log(filepaths);
            filepaths.forEach(filepath => {
                fs.rename(args.files[filepath].path, filepath, (err) => {
                    if (err) throw err;
                    response.write('file uploaded and saved at ' + filepath);
                    response.end(); // this doesn't work with multiple files
                });
            });
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