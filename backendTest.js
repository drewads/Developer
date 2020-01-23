const request = new XMLHttpRequest();

function formSubmit() {
    request.addEventListener("load", reqListener);
    request.open("POST", "http://localhost:8080/create");
    request.setRequestHeader('Content-Type', 'text/plain');
    request.send(document.getElementById("inputField").value);
}

function reqListener() {
    alert(this.responseText);
}