// Create
let createTest = (dir, filename, type) => {
    const request = new XMLHttpRequest();
    request.addEventListener("load", reqListener);
    request.open('PUT', 'http://dev.localhost:8080/client-dev-interface/create');
    request.setRequestHeader('Content-Type', 'application/json');
    let body = {'Directory' : dir,
                'Filename' : filename,
                'Type': type};
    request.send(JSON.stringify(body));

    function reqListener() {
        alert(this.responseText);
    }
}

//createTest('/dev_root/test', 'hello', 'File');