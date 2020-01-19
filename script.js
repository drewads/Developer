let selectedObject = null; // maybe wanna use react to create something where onclick of system object,
                    // there is a component that handles everything and stores all the data

let systemObjects = document.getElementsByClassName("systemObject");

for (let o of systemObjects) {
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