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

    curElem.style.color = (responseText === expectedResponse ? 'green' : 'red');

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
 * @param {string} testName 
 * @param {string} expectedResult 
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
const createTest = async (filepath, isDir, testName, expectedResult) => {
    // HTTP request headers
    const headers = {'Content-Type': 'application/json'};
    // HTTP request body, a JSON string encoding of Javascript Object
    const body = JSON.stringify({'Filepath' : filepath, 'isDirectory': isDir});
    return await genericTest('PUT', 'create', headers, body, testName, expectedResult);
}

/**
 * moveTest uses genericTest to make one test for the move dev module.
 * 
 * @param {string} oldPath path of the object to move
 * @param {string} newPath path to move the object to
 * @param {string} testName name of this test
 * @param {string} expectedResult the expected HTTP response body text
 * @return {Promise} resolved when test completes
 */
const moveTest = async (oldPath, newPath, testName, expectedResult) => {
    // HTTP request headers
    const headers = {'Content-Type': 'application/json'};
    // HTTP request body
    const body = JSON.stringify({'oldPath': oldPath, 'newPath': newPath});
    return await genericTest('PATCH', 'move', headers, body, testName, expectedResult);
}

/**
 * dirSnapshotTest uses genericTest to make one test for the dir-snapshot dev module.
 * 
 * @param {string} dirPath path to the directory to take snapshot of
 * @param {string} testName name of this test
 * @param {string} expectedResult the expected HTTP response body text
 * @return {Promise} resolved when test completes
 */
const dirSnapshotTest = async (dirPath, testName, expectedResult) => {
    return await genericTest('GET', 'dir-snapshot?Directory=' + dirPath, {}, '', testName, expectedResult);
}

// put saveTest here

/**
 * editTest uses genericTest to make one test for the edit dev module.
 * 
 * @param {string} fileath path to the file to get contents of
 * @param {string} testName name of this test
 * @param {string} expectedResult the expected HTTP response body text
 * @return {Promise} resolved when test completes
 */
const editTest = async (filepath, testName, expectedResult) => {
    return await genericTest('GET', 'edit?Filepath=' + filepath, {}, '', testName, expectedResult);
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
.then(() => createTest('/dev_root/test/hihi/hello/subhello', true, 'Create Test 8',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/helloChild2', true, 'Create Test 8a',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/helloChild3', true, 'Create Test 8c',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/index.html', false, 'Create Test 9',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/styles.css', false, 'Create Test 10',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/hello/script.js', false, 'Create Test 11',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/more/insideMore', true, 'Create Test 12',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/more/moreFile.htaccess', false, 'Create Test 13',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/toBeInsideMore', true, 'Create Test 14',
                        'Directory successfully created.'))
.then(() => createTest('/dev_root/test/hihi/index.html', false, 'Create Test 15',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/styles.css', false, 'Create Test 16',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/script.js', false, 'Create Test 17',
                        'File successfully created.'))
.then(() => createTest('/dev_root/test/hihi/helloChild3', true, 'Create Test 18',
                        'Directory successfully created.'))
.then(() => createTest('/../gotcha.txt', false, 'Create Test 19',
                        'Create failed: invalid filepath.'))
.catch(error => alert('Something went wrong with Create tests.'))
.then(() => document.body.appendChild(document.createElement('br')))

/******************** Testing for Move Module ********************/
.then(() => moveTest('/dev_root/test/hihi/index.html', '/dev_root/test/hihi/toBeInsideMore/index.html',
        'Move Test 1', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/toBeInsideMore', '/dev_root/test/hihi/more/toBeInsideMore',
                    'Move Test 2', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/toDelete.txt',
                    '/dev_root/test/hihi/hello/helloChild2/toDelete.txt',
                    'Move Test 3', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/script.js', '/dev_root/test/hihi/more/script.js',
                    'Move Test 4', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/hello/script.js', '/dev_root/test/hihi/script.js',
                    'Move Test 5', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/hello/styles.css',
                    '/dev_root/test/hihi/hello/subhello/styles.css',
                    'Move Test 6', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/hello/subhello', '/dev_root/test/hihi/more/subhello',
                    'Move Test 7', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/styles.css', '/dev_root/test/hihi/more/subhello/styles.css',
                    'Move Test 8', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/hello/index.html',
                    '/dev_root/test/hihi/more/toBeInsideMore/index.html',
                    'Move Test 9', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/helloChild3', '/dev_root/test/hihi/hello/helloChild3',
                    'Move Test 10', 'Move successful.'))
.then(() => moveTest('/dev_root/test/hihi/hello/helloChild3', '/dev_root/test/hihi/more',
                    'Move Test 11', 'Move failed: attempted move to existing nonempty directory.'))
.then(() => moveTest('/dev_root/test/hihi/goodbye', '/dev_root/test/hihi/goodday',
                    'Move Test 12', 'Move failed: filesystem entry does not exist.'))
.then(() => moveTest('/dev_root/test/hihi/goodday.txt', '/dev_root/test/hihi/goodday.html',
                    'Move Test 13', 'Move failed: filesystem entry does not exist.'))
.then(() => genericTest('POST', 'move', {'Content-Type': 'application/json'},
                        {'oldPath': '/dev_root/test/hihi/hello', 'newPath': '/dev_root/test/hihi/hi'},
                        'Move Test 14', 'Move failed: method not allowed.'))
.then(() => genericTest('PATCH', 'move', {'Content-Type': 'text/plain'}, 'hi', 'Move Test 15',
                        'Move failed: request body could not be parsed as JSON.'))
.then(() => genericTest('PATCH', 'move', {'Content-Type': 'application/json'},
                        JSON.stringify({'oldPath': '/dev_root/test/hihi/hello', 'nonewPath': 'hi'}),
                        'Move Test 16', 'Move failed: request body has incorrect content type/format.'))
.then(() => moveTest('/../thisIsAboveRoot/hello/gday.html', '/dev_root/test/hihi/goodday.html',
                        'Move Test 17', 'Move failed: invalid filepath.'))
.then(() => moveTest('/dev_root/test/hihi/goodday.txt', '/dev_root/../../aboveRoot/test/hihi/goodday.html',
                    'Move Test 18', 'Move failed: invalid filepath.'))
.catch(error => alert('Something went wrong with move tests.'))
.then(() => document.body.appendChild(document.createElement('br')))

/******************** Testing for Dir-Snapshot Module ********************/
.then(() => dirSnapshotTest('/dev_root/test/hihi/&RandoGarbage=37', 'DirSnapshot Test 1',
                            JSON.stringify([{'name': 'hello', 'isDir': true},
                            {'name': 'more', 'isDir': true}, {'name': 'script.js', 'isDir': false}])))
.then(() => dirSnapshotTest('/dev_root/test/hihi/hello/helloChild3', 'DirSnapshot Test 2',
                            JSON.stringify([])))
.then(() => dirSnapshotTest('/dev_root/test/hihi/more', 'DirSnapshot Test 3',
                            JSON.stringify([{'name': 'insideMore', 'isDir': true},
                            {'name': 'moreFile.htaccess', 'isDir': false},
                            {'name': 'script.js', 'isDir': false}, {'name': 'subhello', 'isDir': true},
                            {'name': 'toBeInsideMore', 'isDir': true}])))
.then(() => dirSnapshotTest('/dev_root/test/hihi/more/toBeInsideMore/', 'DirSnapshot Test 4',
                            JSON.stringify([{'name': 'index.html', 'isDir': false}])))
.then(() => dirSnapshotTest('/dev_root/test/hihi/thisDontexist/', 'DirSnapshot Test 5',
                            'directory does not exist'))
.then(() => dirSnapshotTest('/dev_root/test/hihi/script.js', 'DirSnapshot Test 6',
                            'filesystem entry is not a directory'))
.then(() => genericTest('POST', 'dir-snapshot?Directory=', {}, '', 'DirSnapshot Test 7',
                        'method not allowed'))
.then(() => genericTest('GET', 'dir-snapshot?Direcory=/dev_root/test/hihi/&RandoGarbage=37', {}, '',
                        'DirSnapshot Test 8', 'incorrect querystring'))
.then(() => dirSnapshotTest('/../thisIsAboveRoot/hi', 'DirSnapshot Test 9', 'invalid filepath'))
.catch(error => alert('Something went wrong with dir-snapshot tests.'))
.then(() => document.body.appendChild(document.createElement('br')))

/******************** Testing for Edit Module ********************/
// need more tests here -- below is just tests that trigger errors
.then(() => editTest('/dev_root/test/hihi/hello/helloChild3', 'Edit Test 1',
                    'filesystem entry is a directory'))
.then(() => editTest('/dev_root/test/hihi/thisDoesntExist.txt', 'Edit Test 2',
                    'file does not exist'))
.then(() => genericTest('POST', 'edit?Filepath=/dev_root/test/hihi/text.txt', {}, '',
                    'Edit Test 3', 'method not allowed'))
.then(() => genericTest('GET', 'edit?Filpath=/dev_root/test/hihi/text.txt', {}, '',
                    'Edit Test 4', 'incorrect querystring'))
.then(() => editTest('/../../WayAboveRoot/thisDoesntExist.txt', 'Edit Test 5',
                    'invalid filepath'))
.catch(error => alert('Something went wrong with edit tests.'))
.then(() => document.body.appendChild(document.createElement('br')))

/******************** Testing for Delete Module ********************/
.then(() => deleteTest('/dev_root/test/hihi/hello/helloChild2/toDelete.txt', false, 'Delete Test -2',
                        'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/helloChild2', true, 'Delete Test -2b',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/helloChild3', true, 'Delete Test -2c',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/insideMore', true, 'Delete Test -1',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/moreFile.htaccess', false,
                        'Delete Test -1b', 'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/script.js', false,
                        'Delete Test -1c', 'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/subhello/styles.css', false,
                        'Delete Test -1d', 'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/subhello', true,
                        'Delete Test -1e', 'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/toBeInsideMore/index.html', false,
                        'Delete Test -1f', 'File successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more/toBeInsideMore', true,
                        'Delete Test -1h', 'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi/more', true, 'Delete Test -1',
                        'Directory successfully deleted.'))
.then(() => deleteTest('/dev_root/test/hihi', true, 'Delete Test 0',
                        'Delete failed: directory not empty.'))
.then(() => deleteTest('/dev_root/test/hihi/script.js', true, 'Delete Test 1',
                        'Delete failed: directory could not be removed.'))
.then(() => deleteTest('/dev_root/test/hihi/hello/', false, 'Delete Test 2',
                        'Delete failed: file could not be removed.'))
.then(() => deleteTest('/dev_root/test/hihi/script.js', false, 'Delete Test 3',
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
.then(() => deleteTest('/../thisIsAboveRoot', true, 'Delete Test 12',
                        'Delete failed: invalid filepath.'))
.catch(error => alert('Something went wrong with Delete tests.'));