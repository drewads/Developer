// Create
let createTest = (dir, filename, isDir, testName, callback) => {
    const request = new XMLHttpRequest();
    request.addEventListener("load", reqListener);
    request.open('PUT', 'http://dev.localhost:8080/client-dev-interface/create');
    request.setRequestHeader('Content-Type', 'application/json');
    const body = {'Directory' : dir,
                'Filename' : filename,
                'isDirectory': isDir};
    request.send(JSON.stringify(body));

    // shouldn't be arrow function
    function reqListener() {
        const curElem = document.createElement("div");
        curElem.innerText = testName + ': ' + this.responseText;
        document.body.appendChild(curElem);
        callback();
    }
}

// requests need to be made in sequence because they are handled asynchronously on the server
/*
    0: work
    1: work
    2: fail
    3: fail
    4: work
    5: fail
*/
createTest('/dev_root/test/hihi/', 'washang', true, 'Create Test 0', () => {
    createTest('/dev_root/test/hihi/sup', 'hello', true, 'Create Test 1', () => {
        createTest('/dev_root/test/hihi/sup/', '', false, 'Create Test 2', () => {
            createTest('/dev_root/test/hihi/sup/', '', true, 'Create Test 3', () => {
                createTest('/dev_root/test/hihi/sup/', 'hi', false, 'Create Test 4', () => {
                    createTest('/dev_root/test/hihi/sup', 'hi', false, 'Create Test 5', () => {});
                });
            });
        });
    });
});