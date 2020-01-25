// This is the main server for drewwadsworth.com
// make constant variable here root of the website
// maybe want different constant variable root of dev.drewwadsworth.com
// otherwise, when we receive dev requests, just serve dev UI
// redirect drewwadsworth.com/dev to dev.drewwadsworth.com
// redirect http://drewwadsworth.com and http://dev.drewwadsworth.com to https with 308: permanent redirect

const http = require('http');
const url = require('url');

const cdi = require('./client-dev-interface/client-dev-interface');

const devRoot = '/Users/drewwadsworth/Documents/Developer/dev_root';
const systemRoot = '/Users/drewwadsworth/Documents/Developer'
const devURLRegex = /^\/client-dev-interface/;

const server = http.createServer((request, response) => {
    const query = url.parse(request.url, true);

    // when we receive dev requests with url pathname = /client-dev-interface pass to client-dev-interface
    if (devURLRegex.test(query.pathname)) { //maybe use node url fileurltopath instead?
        cdi.handle(request, response, systemRoot);
    }
});