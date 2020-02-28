// this doesnt actually work on non text files
const uploadFile = () => {
    const files = document.getElementById('upload').files;
    const file = files[0];
    const upload = new XMLHttpRequest();
    upload.addEventListener('load', reqListener);
    upload.open('PUT', 'http://dev.localhost:8080/client-dev-interface/save?Filepath=/dev_root/' + file.name);
    console.log(file.type);
    upload.setRequestHeader('Content-Type', file.type);
    upload.send(file.text);
}

document.getElementById('upload').onchange = uploadFile;

const request = new XMLHttpRequest();

function formSubmit() {
    request.addEventListener("load", reqListener);
    request.open("PUT", "http://dev.localhost:8080/client-dev-interface/create");
    request.setRequestHeader('Content-Type', 'application/json');
    let body = {Directory : document.getElementById("inputField1").value,
                Filename : document.getElementById("inputField2").value};
    request.send(JSON.stringify(body));
}

function reqListener() {
    alert(this.responseText);
}