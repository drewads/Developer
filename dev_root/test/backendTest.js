const uploadFiles = () => {
    const files = document.getElementById('upload').files;
    const dir = '/Users/drewwadsworth/documents/Developer/dev_root/test/';
    const uploadForm = new FormData();
    uploadForm.append('name', 'drew');
    for (const file of files) {
        console.log(file.name);
        uploadForm.append(dir + file.name, file);
        console.log(uploadForm);
    }
    console.log(uploadForm.entries());
    const upload = new XMLHttpRequest();
    upload.addEventListener('load', reqListener);
    upload.open('PUT', 'http://localhost:8080');
    upload.send(uploadForm);
}

document.getElementById('upload').onchange = uploadFiles;

function reqListener() {
    alert(this.responseText);
}