// Create
let createTest = (dir, filename, isDir) => {
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
        alert(this.responseText);
    }
}

createTest('/dev_root/test/hihi', 'hello', true);