const request = new XMLHttpRequest();
const fileLabel = "File: ";
const dirLabel = "Directory: ";

function formSubmit() {
    request.addEventListener("load", reqListener);
    request.open("POST", "http://localhost:8080/create");
    request.setRequestHeader('Content-Type', 'text/plain');
    let body = fileLabel + document.getElementById("inputField").value + "\n"
                + dirLabel + "" + "\n";
    request.send(body);
}

function reqListener() {
    alert(this.responseText);
}