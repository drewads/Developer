/*************************** Move/Rename Elements Toggling **********************************/
let move_rename_engaged = false;

for (const button of document.getElementsByClassName('FSButton')) {
    button.addEventListener('click', event => {
        event.preventDefault();
        if (move_rename_engaged) {
            for (const elem of document.getElementsByClassName('moveElems')) {
                elem.style.visibility = 'hidden';
            }
            document.getElementById('moveFrom').style.display = 'none';
            document.getElementById('generalInput').style.width = '100%';
            move_rename_engaged = false;
        } else if (button.id === 'move_rename') {
            for (const elem of document.getElementsByClassName('moveElems')) {
                elem.style.visibility = 'visible';
            }
            document.getElementById('moveFrom').style.display = 'block';
            document.getElementById('generalInput').style.width = '90%';
            move_rename_engaged = true;
        }
    });
}

/*************************** Create Editor and Add Value to it **********************************/
const editor = CodeMirror.fromTextArea(document.getElementById('editorTextArea'), {
    lineNumbers: true
});

editor.setSize('100%', '100%');


const DONE_STATE = 4; // when the HTTP request is completely finished, including response

const request = new XMLHttpRequest();

// when we get the entire HTTP response back from the server
request.onreadystatechange = () => {
    if (request.readyState === DONE_STATE) {
        editor.setValue(request.response);
        editor.setOption('mode', request.getResponseHeader('Content-Type'));
    }
}

// devModule has no file extension
request.open('GET', 'http://dev.localhost:8080/client-dev-interface/edit?Filepath=/dev_root/script.js');

request.send();

/*************************** Select SystemObjects function **********************************/

let selectedObject = null; // maybe wanna use react to create something where onclick of system object,
                    // there is a component that handles everything and stores all the data
                    // if i was gonna do this without react, i would make this a class

const systemObjects = document.getElementsByClassName("systemObject");

for (const o of systemObjects) {
    o.addEventListener("click", () => {selectObject(o)});
}

document.getElementById("navWrapper").addEventListener("click", () => {unselectObject()}, true);

/*
* highlights object, unhighlights previous object, changes above input field to filepath,
* and updates global var
*/
function selectObject(object) {
    if (selectedObject) {
        selectedObject.setAttribute("style", "background-color: transparent;");
    }
    
    object.setAttribute("style", "background-color: #b0d6f5;");
    
    document.getElementById("manageFSForm").value
        = document.getElementById("navigatorPath").innerText
        + object.getElementsByClassName("systemObjectLabel")[0].innerText;
    
    selectedObject = object;
}

/*
* unhighlights object, wipes above input field, and sets global var to null
*/
function unselectObject() {
    if (selectedObject) {
        selectedObject.setAttribute("style", "background-color: transparent;");
    }

    document.getElementById("manageFSForm").value = "";
    selectedObject = null;
}