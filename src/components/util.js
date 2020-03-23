'use strict';

/**
 * makeCDIRequest makes an HTTP request to the server to perform a client-dev-interface
 * function. It returns a Promise that is resolved on successful completion of the
 * client-dev-interface function and is rejected on failure. The value of the Promise
 * is the response body no matter whether the Promise is resolved and rejected.
 * 
 * @param {string} method HTTP request method
 * @param {string} devModule the devModule part of the URL
 * @param {object} headers javascript object containing headers and values as key-value pairs
 * @param {string} body if object, must be JSON.stringify()ed by caller
 * @returns {Promise} Promise resolved or rejected when entire response received
 */
const makeCDIRequest = (method, devModule, headers, body) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        const DONE_STATE = 4; // HTTP request state when entire response has been received

        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject(request.response);
                }
            }
        }

        request.open(method, `${window.location.protocol}//${window.location.host}/client-dev-interface/${devModule}`);
        
        // handles a JavaScript object containing request header key-value pairs
        for (const header in headers) {
            request.setRequestHeader(header, headers[header]);
        }

        request.send(body);
    });
}

export default { makeCDIRequest };