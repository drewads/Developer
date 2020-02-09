'use strict';
const DONE_STATE = 4;

const compareAndPrintResults = (testName, responseText, expectedResponse) => {
    const curElem = document.createElement("div");
    console.log(responseText);
    curElem.innerText = 'Test '
    + (responseText === expectedResponse ? 'Success' : 'Failure')
    + '. ' + testName + ': ' + responseText;
    document.body.appendChild(curElem);
}

// All requests need to be made in sequence because they are handled asynchronously on the server

// if body is JSON, it must already be stringified
const genericTest = (method, devModule, headers, body, testName, expectedResult) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults(testName, request.response, expectedResult);
                resolve();
            }
        }
        request.open(method, 'http://dev.localhost:8080/client-dev-interface/' + devModule);
        
        for (const header in headers) {
            request.setRequestHeader(header, headers[header]);
        }
        request.send(body);
    });
}

// Create
const createTest = (dir, filename, isDir, testName, expectedResult) => {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'Directory' : dir, 'Filename' : filename, 'isDirectory': isDir});
    return genericTest('PUT', 'create', headers, body, testName, expectedResult);
}

/*
    Create
    0: work
    1: work
    2: fail
    3: fail
    4: work
    5: fail
*/
/*
createTest('/dev_root/test/hihi/', 'washang', true, 'Create Test 0')
.then(() => createTest('/dev_root/test/hihi/sup', 'hello', true, 'Create Test 1'))
.then(() => createTest('/dev_root/test/hihi/sup/', '', false, 'Create Test 2'))
.then(() => createTest('/dev_root/test/hihi/sup/', '', true, 'Create Test 3'))
.then(() => createTest('/dev_root/test/hihi/sup/', 'hi', false, 'Create Test 4'))
.then(() => createTest('/dev_root/test/hihi/sup', 'hi', false, 'Create Test 5'))
.catch(error => alert('Something went wrong with Create tests.'))
.then(() => document.body.appendChild(document.createElement('br')));
*/



// Delete
const deleteTest = async (filepath, isDir, testName, expectedResult) => {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'Filepath': filepath, 'isDirectory': isDir});
    return await genericTest('DELETE', 'delete', headers, body, testName, expectedResult);
}

deleteTest('/dev_root/test/hihi', true, 'Delete Test 0',
            'Delete failed: directory could not be removed.')
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
.catch(error => alert('Something went wrong with Delete tests.'));