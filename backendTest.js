const request = new XMLHttpRequest();
const fileLabel = "File: ";
const dirLabel = "Directory: ";

function formSubmit() {
    request.addEventListener("load", reqListener);
    request.open("POST", "http://localhost:8080/client-dev-interface/create/");
    request.setRequestHeader('Content-Type', 'application/json');
    let body = {Directory : document.getElementById("inputField1").value,
                Filename : document.getElementById("inputField2").value};
    request.send(JSON.stringify(body));
}

function reqListener() {
    alert(this.responseText);
}