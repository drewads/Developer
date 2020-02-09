'use strict';
const DONE_STATE = 4;

const compareAndPrintResults = (testName, responseText, expectedResponse) => {
    const curElem = document.createElement("div");
    curElem.innerText = 'Test '
    + (responseText === expectedResponse ? 'Success' : 'Failure')
    + '. ' + testName + ': ' + responseText;
    document.body.appendChild(curElem);
}

// All requests need to be made in sequence because they are handled asynchronously on the server

// const genericTest = ()

// Create
const createTest = (dir, filename, isDir, testName, expectedResult) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults(testName, request.response, expectedResult);
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
const deleteTest = (filepath, isDir, testName, expectedResult) => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults(testName, request.response, expectedResult);
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
/*.then(() => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults('Delete Test 7', request.response,
                'Delete failed: method not allowed.');
                resolve();
            }
        }

        request.open('POST', 'http://dev.localhost:8080/client-dev-interface/delete');
        request.setRequestHeader('Content-Type', 'application/json');
        const body = {'Filepath': filepath,
                    'isDirectory': isDir};
        request.send(JSON.stringify(body));
    })
})
.then(() => {
    return new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === DONE_STATE) {
                compareAndPrintResults('Delete Test 7', request.response,
                'Delete failed: request body has incorrect format.');
                resolve();
            }
        }

        request.open('DELETE', 'http://dev.localhost:8080/client-dev-interface/delete');
        request.setRequestHeader('Content-Type', 'application/json');
        const body = {'Filepath': filepath,
                    'someOtherAttribute': isDir};
        request.send(JSON.stringify(body));
    })
})*/
.catch(error => alert('Something went wrong with Delete tests.'));