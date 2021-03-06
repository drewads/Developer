'use strict';

/**
 * makeCDIRequest makes an HTTP request to the server to perform a client-dev-interface
 * function. It returns a Promise that is resolved on successful completion of the
 * client-dev-interface function and is rejected on failure. The value of the Promise
 * is the XMLHttpRequest object on resolve and the response body on reject.
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
                    resolve(request);
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

const getMediaType = (mimeType) => {
    const delim = mimeType.indexOf(';');
    
    return (delim === -1 ? mimeType : mimeType.substring(0, delim));
}

const confirmOverwrite = async (destPath) => {
    // check destPath doesn't already exist
    try {
        await makeCDIRequest('GET', `exists?Filepath=${destPath.toString()}`, {}, {});
        if (window.confirm(`The file ${destPath.toString()} already exists. Would you like to replace it?`)) {
            return true;
        } else return false;
    } catch (error) {
        if (error === 'filesystem entry does not exist') {
            return true;
        } else {
            alert(error);
            return false;
        }
    }
}

export default { makeCDIRequest, getMediaType, confirmOverwrite };