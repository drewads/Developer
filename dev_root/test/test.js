'use strict';
const DONE_STATE = 4;
// All requests need to be made in sequence because they are handled asynchronously on the server

// Create
const createTest = (dir, filename, isDir, testName) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                const curElem = document.createElement("div");
                curElem.innerText = testName + ': ' + request.response;
                document.body.appendChild(curElem);
                resolve();
            }
        }
        request.open('PUT', 'http://dev.localhost:8080/client-dev-interface/create');
        request.setRequestHeader('Content-Type', 'application/json');
        const body = {'Directory' : dir,
                    'Filename' : filename,
                    'isDirectory': isDir};
        request.send(JSON.stringify(body));
    });
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

createTest('/dev_root/test/hihi/', 'washang', true, 'Create Test 0')
.then(() => createTest('/dev_root/test/hihi/sup', 'hello', true, 'Create Test 1'))
.then(() => createTest('/dev_root/test/hihi/sup/', '', false, 'Create Test 2'))
.then(() => createTest('/dev_root/test/hihi/sup/', '', true, 'Create Test 3'))
.then(() => createTest('/dev_root/test/hihi/sup/', 'hi', false, 'Create Test 4'))
.then(() => createTest('/dev_root/test/hihi/sup', 'hi', false, 'Create Test 5'))
.catch(error => alert('Something went wrong with Create tests.'))
.then(() => document.body.appendChild(document.createElement('br')));



// Delete
const deleteTest = (filepath, isDir, testName) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                const curElem = document.createElement("div");
                curElem.innerText = testName + ': ' + request.response;
                document.body.appendChild(curElem);
                resolve();
            }
        }
        request.open('DELETE', 'http://dev.localhost:8080/client-dev-interface/delete');
        request.setRequestHeader('Content-Type', 'application/json');
        const body = {'Filepath': filepath,
                    'isDirectory': isDir};
        request.send(JSON.stringify(body));
    });
}