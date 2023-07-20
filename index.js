
const downloadButton = document.getElementById("download-button");
if (downloadButton) {
    downloadButton.addEventListener("click", download);
}
const selectButton = document.getElementById("select-button");
if (selectButton) {
    selectButton.addEventListener("click", () => fileInput.click());
}
const fileInput = document.getElementById("file-input");
if (fileInput) {
    fileInput.addEventListener("change", upload);
}
const listButton = document.getElementById("list-button");
if (listButton) {
    listButton.addEventListener("click", listFiles);
}
const deleteButton = document.getElementById("delete-button");
if (deleteButton) {
    deleteButton.addEventListener("click", deleteFile);
}
const Status = document.getElementById("status");
if (Status) {
    Status.addEventListener("click", () => {
        Status.style.display = "none";
    });
}
const fileList = document.getElementById("file-list");
const consumerName = document.getElementById("customer-name");


const cloudOption = document.getElementById("cloud-option");


console.log('Imported index.js')
// alert('Imported index.js')

// listButton.addEventListener("click", listFiles);
// selectButton.addEventListener("click", () => fileInput.click());
// downloadButton.addEventListener("click", download);
// deleteButton.addEventListener("click", deleteFile);
// fileInput.addEventListener("change", upload);

function upload(){
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    var whichPlatform = cloudOption.options[cloudOption.selectedIndex].text;
    const url = 'http://localhost:3000/cloud/upload/'+whichPlatform;

    formData.append("location", whichPlatform);
    formData.append("created_by", consumerName.value) //TODO
    
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(fileInput.files[0])
        console.log(data);
        Status.style.display = "block";
        Status.innerHTML += "File uploaded successfully\n";
    });
}

function download(){
    var whichPlatform = cloudOption.options[cloudOption.selectedIndex].text;
    var file = fileList.value;
    console.log(file);
    const url = 'http://localhost:3000/cloud/'+whichPlatform+'/'+fileList.value;
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data['message']['data']);
        console.log(typeof(data['message']['data']));

        // TODO: change this to download the file
        // if ( AWS ) 
        // const blob  = new Blob([data['message']['data']], {type: 'application/octet-stream'});
        const blobName = file; // TODO: change this to the name of the file
        // const url = window.URL.createObjectURL(blob);
        // else if ( Azure )
        const url = data['message']['data'];

        const a = Object.assign(document.createElement('a'), {
            href: url,
            display: 'none',
            download: blobName,
        });

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        console.log(url);
        Status.style.display = "block";
        Status.innerHTML += "File downloaded successfully\n";
    });
}

function deleteFile(){
    var whichPlatform = cloudOption.options[cloudOption.selectedIndex].text;
    const url = 'http://localhost:3000/cloud/delete/'+whichPlatform+'/'+fileList.value;
    fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        Status.style.display = "block";
        Status.innerHTML += "File deleted successfully\n";
    })
}

function listFiles(){
    // var val = cloudOption.value;
    var whichPlatform = cloudOption.options[cloudOption.selectedIndex].text;

    const url = 'http://localhost:3000/cloud/read/'+whichPlatform;
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(res) {
         return res.json(); 
    }).then(function(data) {
        let list = data['message'];
        console.log(list);
        fileList.innerHTML = "";
        if(list.length == 0){
            html += `<li>No files found</li>`;
        }
        else {
            list.forEach(function(file) {
                fileList.innerHTML += `<option>${file}</option>`;
            });
        }

    })
}

