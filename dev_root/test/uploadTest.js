/**
 * This file contains the client-side javascript for testing the
 * upload dev module.
 */

const DONE_STATE = 4; // when the HTTP request is completely finished, including response

 /**
  * uploadFiles sends an HTTP request with multipart/form-data body
  * to the upload client-dev-interface module. It will send multiple
  * files in the body of the single request if multiple files are
  * selected. In the multipart/form-data body, the key for each file
  * is the filepath it should be saved at on the server.
  */
const uploadFiles = (files, dir, requestMethod) => {
    return new Promise(resolve => {
        const uploadForm = new FormData();

        for (const file of files) {
            uploadForm.append(dir + file.name, file);
        }

        const upload = new XMLHttpRequest();

        // when we get the entire HTTP response back from the server
        upload.onreadystatechange = () => {
            if (upload.readyState === DONE_STATE) {
                resolve(upload.response);
            }
        }

        upload.open(requestMethod, 'http://dev.localhost:8080/client-dev-interface/upload');
        upload.send(uploadForm);
    });
}

// trigger uploadFiles() when files are selected with the filepicker input element
document.getElementById('upload').addEventListener('change', () => {
    const files = document.getElementById('upload').files;
    const dir = '/dev_root/test/';
    uploadFiles(files, dir, 'PUT')
    .then((response) => {
        const elem = document.createElement("div");
        elem.innerText = 'Upload Test 1. '
                        + (response === 'file(s) successfully uploaded' ? 'success' : 'failure')
                        + ': ' + response;
        document.body.appendChild(elem);
    }).catch((error) => alert('problem with Upload Test 1.\n' + error));
});

// add test with incorrect method - will now get incorrect method

// add test that has directory that is above filesystem to get isDescendantOf error

// add test to make rename not work - maybe incorrect dir

// add test with incorrect multipart/form-data body - will now get 'request body has incorrect format'

// add test with some other body type - will now get 'request body has incorrect format'

