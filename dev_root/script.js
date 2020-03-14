const DONE_STATE = 4; // when HTTP request is completely finished, including response

/*************************** Select SystemObjects function **********************************/

let selectedObject = null; // maybe wanna use react to create something where onclick of system object,
                    // there is a component that handles everything and stores all the data
                    // if i was gonna do this without react, i would make this a class

const setSystemObjectEvents = (object) => {
    object.addEventListener("click", () => {selectObject(object)});
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

/*************************** Move/Rename Elements Toggling **********************************/
const dirRequest = new XMLHttpRequest();
// when we get the entire HTTP response back from the server
dirRequest.onreadystatechange = () => {
    if (dirRequest.readyState === DONE_STATE) {
        if (dirRequest.status === 200) {
            const elements = JSON.parse(dirRequest.response);
            const navViewer = document.getElementById('navViewer');
            for (const element of elements) {
                const outerDiv = document.createElement('div');
                outerDiv.className = 'systemObject';
                const img = document.createElement('img');
                img.src = (element['isDir'] ? 'GenericFolderIcon.png' : 'GenericDocumentIcon.png')
                const label = document.createElement('div');
                label.className = 'systemObjectLabel';
                label.innerText = element['name'];
                outerDiv.append(img);
                outerDiv.append(label);
                navViewer.append(outerDiv);
                setSystemObjectEvents(outerDiv);
            }
        } else {
            alert(dirRequest.response);
        }
    }
}

// devModule has no file extension
dirRequest.open('GET', 'http://dev.localhost:8080/client-dev-interface/dir-snapshot?Directory=/');

dirRequest.send();

/*************************** Move/Rename Elements Toggling **********************************/

let move_rename_engaged = false;
let create_dropdown_engaged = false;

const engageMoveRename = () => {
    for (const elem of document.getElementsByClassName('moveElems')) {
        elem.style.visibility = 'visible';
    }
    document.getElementById('moveFrom').style.display = 'block';
    document.getElementById('generalInput').style.width = '90%';
    move_rename_engaged = true;
}

const engageCreateDropdown = () => {
    document.getElementById('createDropdown').style.display = 'block';
    create_dropdown_engaged = true;
}

const disengageMoveRename = () => {
    for (const elem of document.getElementsByClassName('moveElems')) {
        elem.style.visibility = 'hidden';
    }
    document.getElementById('moveFrom').style.display = 'none';
    document.getElementById('generalInput').style.width = '100%';
    move_rename_engaged = false;
}

const disengageCreateDropdown = () => {
    document.getElementById('createDropdown').style.display = 'none';
    create_dropdown_engaged = false;
}

const createClicked = (event) => {
    event.preventDefault();
    
    if (move_rename_engaged) {
        disengageMoveRename();
    }
    
    if (create_dropdown_engaged) {
        disengageCreateDropdown();
    } else {
        engageCreateDropdown();
    }
}

const createFileClicked = () => {
    disengageCreateDropdown();
}

const createDirClicked = () => {
    disengageCreateDropdown();
}

const editClicked = (event) => {
    event.preventDefault();
    
    if (move_rename_engaged) {
        disengageMoveRename();
    }
    
    if (create_dropdown_engaged) {
        disengageCreateDropdown();
    }
}

const uploadClicked = (event) => {
    event.preventDefault();
    
    if (move_rename_engaged) {
        disengageMoveRename();
    }
    
    if (create_dropdown_engaged) {
        disengageCreateDropdown();
    }

    document.getElementById('uploadInput').click();
}

const moveRenameClicked = (event) => {
    event.preventDefault();
    
    if (create_dropdown_engaged) {
        disengageCreateDropdown();
    }

    if (move_rename_engaged) {
        disengageMoveRename();
    } else {
        engageMoveRename();
    }
}

const deleteClicked = (event) => {
    event.preventDefault();

    if (move_rename_engaged) {
        disengageMoveRename();
    }
    
    if (create_dropdown_engaged) {
        disengageCreateDropdown();
    }
}

document.getElementById('create').addEventListener('click', event => createClicked(event));
document.getElementById('edit').addEventListener('click', event => editClicked(event));
document.getElementById('upload').addEventListener('click', event => uploadClicked(event));
document.getElementById('move_rename').addEventListener('click', event => moveRenameClicked(event));
document.getElementById('delete').addEventListener('click', event => deleteClicked(event));
document.getElementById('createFile').addEventListener('click', event => createFileClicked(event));
document.getElementById('createDir').addEventListener('click', event => createDirClicked(event));

/*************************** Create Editor and Add Value to it **********************************/
const editor = CodeMirror.fromTextArea(document.getElementById('editorTextArea'), {
    lineNumbers: true
});

editor.setSize('100%', '100%');

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