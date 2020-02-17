/**
* This is a test file for client-dev-interface that conducts tests
* from the client by sending HTTP requests. Responses are compared
* to the expected outcome and deemed correct or incorrect.
*
* All HTTP requests must be made in sequence with Promise chains
* because they are handled asynchronously on the server.
*/

'use strict';

const DONE_STATE = 4; // when the HTTP request is completely finished, including response

/**
 * compareAndPrintResults compares the HTTP response body to the expected response
 * body, evaluating whether the test was successful, and creates a new HTML element
 * in the DOM containing success/failure info, test name, and HTTP response received.
 * 
 * @param {string} testName the name of this test
 * @param {string} responseText the HTTP response body
 * @param {string} expectedResponse the expected HTTP response body
 */
const compareAndPrintResults = (testName, responseText, expectedResponse) => {
    const curElem = document.createElement("div");

    // formatted information about the test that is displayed
    curElem.innerText = 'Test '
    + (responseText === expectedResponse ? 'Success' : 'Failure')
    + '. ' + testName + ': ' + responseText;

    document.body.appendChild(curElem);
}

/*
* This is a generic function that carries out a full single test. This has a lot
* of parameters, so wrapper functions are created below for each dev module.
* However, this gives us some flexibility to create some extra tests for a dev
* module that don't fit the typical mold. This function returns a Promise.
*
* Note to caller: if parameter body is JSON, it must already be stringified.
* parameter headers is a JavaScript object with request headers as key-value pairs.
*/
/**
 * 
 * @param {string} method 
 * @param {string} devModule 
 * @param {JavaScript Object} headers 
 * @param {JavaScript Object} body 
 * @param {*} testName 
 * @param {*} expectedResult 
 */
const genericTest = (method, devModule, headers, body, testName, expectedResult) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();

        // when we get the entire HTTP response back from the server
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults(testName, request.response, expectedResult);
                resolve();
            }
        }

        // devModule has no file extension
        request.open(method, 'http://dev.localhost:8080/client-dev-interface/' + devModule);
        
        // handles a JavaScript object containing request header key-value pairs
        for (const header in headers) {
            request.setRequestHeader(header, headers[header]);
        }
        request.send(body);
    });
}

/**
 * createTest uses genericTest to make one test for the create dev module.
 * 
 * @param {string} dir filepath of the directory in which to create a file
 * @param {string} filename name of the object to create
 * @param {boolean} isDir true if object is a directory, false otherwise
 * @param {string} testName the name of this specific test
 * @param {string} expectedResult the expected HTTP response body text
 * @return {Promise} resolved when test completes
 */
const createTest = (filepath, isDir, testName, expectedResult) => {
    // HTTP request headers
    const headers = {'Content-Type': 'application/json'};
    // HTTP request body, a JSON string encoding of Javascript Object
    const body = JSON.stringify({'Filepath' : filepath, 'isDirectory': isDir});
    return genericTest('PUT', 'create', headers, body, testName, expectedResult);
}

/**
 * moveTest uses genericTest to make one test for the move dev module.
 * 
 * @param {string} oldPath path of the object to move
 * @param {string} newPath path to move the object to
 * @param {string} testName name of this test
 * @param {string} expectedResult the expected HTTP response body text
 */
const moveTest = (oldPath, newPath, testName, expectedResult) => {
    // HTTP request headers
    const headers = {'Content-Type': 'application/json'};
    // HTTP request body
    const body = JSON.stringify({'oldPath': oldPath, 'newPath': newPath});
    return genericTest('PATCH', 'move', headers, body, testName, expectedResult);
}

/**
 * deleteTest uses genericTest to make one test for the delete dev module.
 * 
 * @param {string} filepath path of the object to delete
 * @param {boolean} isDir true if object to delete is a directory, false otherwise
 * @param {string} testName name of this test
 * @param {string} expectedResult the expected HTTP response body text
 * @return {Promise} resolved when test completes
 */
const deleteTest = async (filepath, isDir, testName, expectedResult) => {
    // HTTP request headers
    const headers = {'Content-Type': 'application/json'};
    // HTTP request body
    const body = JSON.stringify({'Filepath': filepath, 'isDirectory': isDir});
    return await genericTest('DELETE', 'delete', headers, body, testName, expectedResult);
}

/**************************************** Tests ****************************************/

/******************** Testing for Create Module ********************/
createTest('/dev_root/test/hihi', true, 'Create Test -1', 'Directory successfully created.')
.then(() => createTest('/dev_root/test/hihi/hello/', true, 'Create Test 0',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/toDelete.txt', false, 'Create Test 1',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello', true, 'Create Test 2',
                        'Directory already exists in filesystem.'))
.then(() => createTest('/dev_root/test/hihi/toDelete.txt', false, 'Create Test 3',
                        'File already exists in filesystem.'))
.then(() => genericTest('GET', 'create', {'Content-Type': 'application/json'},
                        JSON.stringify({'Filepath' : '/dev_root/test/hihi/toDelete.txt',
                                        'isDirectory' : false}),
                        'Create Test 4', 'Create failed: method not allowed.'))
.then(() => genericTest('PUT', 'create', {'Content-Type': 'application/json'},
                        {'isDirectory' : false}, 'Create Test 5',
                        'Create failed: request body could not be parsed as JSON.'))
.then(() => genericTest('PUT', 'create', {'Content-Type': 'application/json'},
                        JSON.stringify({'isDirectory' : false}), 'Create Test 6',
                        'Create failed: request body has incorrect content type/format.'))
.then(() => createTest('/dev_root/test/hihi/more', true, 'Create Test 7',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/index.html', false, 'Create Test 8',
                        'File successfully created.'))
.catch(error => alert('Something went wrong with Create tests.'))
.then(() => document.body.appendChild(document.createElement('br')));

/******************** Testing for Move Module ********************/
/*.then(moveTest(''))*/

/******************** Testing for Delete Module ********************/
/*.then(() => deleteTest('/dev_root/test/hihi/hello/index.html', false, 'Delete Test -2',
                        'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more', true, 'Delete Test -1',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi', true, 'Delete Test 0',
                        'Delete failed: directory could not be removed.'))
.then(() => deleteTest('/dev_root/test/hihi/toDelete.txt', true, 'Delete Test 1',
                        'Delete failed: directory could not be removed.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/', false, 'Delete Test 2',
                        'Delete failed: file could not be removed.'))
.then(() => deleteTest('/dev_root/test/hihi/toDelete.txt', false, 'Delete Test 3',
                        'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/', true, 'Delete Test 4',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/hello', true, 'Delete Test 5',
                        'Delete failed: system object does not exist.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/', false, 'Delete Test 6',
                        'Delete failed: system object does not exist.'))
.then(() => genericTest('POST', 'delete', {'Content-Type': 'application/json'},
                        JSON.stringify({'Filepath': '/dev_root/test/hihi/hello/',
                                        'isDirectory': true}), 'Delete Test 7',
                        'Delete failed: method not allowed.'))
.then(() => genericTest('DELETE', 'delete', {'Content-Type': 'application/json'},
                        JSON.stringify({'Filepath': '/dev_root/test/hihi/toDelete.txt',
                                        'someOtherAttribute': -1}), 'Delete Test 8',
                        'Delete failed: request body has incorrect content type/format.'))
.then(() => genericTest('DELETE', 'delete', {'Content-Type': 'text/plain'},
                        'here is my request body', 'Delete Test 9',
                        'Delete failed: request body could not be parsed as JSON.'))
.then(() => genericTest('DELETE', 'delete', {'Content-Type': 'application/json'},
                        'here is my request body', 'Delete Test 10',
                        'Delete failed: request body could not be parsed as JSON.'))
.then(() => deleteTest('/dev_root/test/hihi', true, 'Delete Test 11',
                        'Directory successfully deleted.'))
.catch(error => alert('Something went wrong with Delete tests.'));*/