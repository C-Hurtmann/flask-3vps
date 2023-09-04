const form = document.querySelector("form"),
fileInput = form.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("submit", ()=>{
    fileInput.click();
});

fileInput.onchange = ({target}) =>{
    let fileUrl = target.value // getting url from form
    if (fileUrl){ // if url is selected
        let fileName = fileUrl.split("/").pop(); // getting file name. It is a after the last slash in url
        console.log(fileName);
        uploadFIle(fileUrl); // calling uploadFile with passing file name as an argument
    }
}

function uploadFIle(url) {
    let xhr = new XMLHttpRequest(); // creating new xml object (AJAX)
    xhr.open("POST", "/upload"); // sending post request to the specified url
    xhr.upload.addEventListener("progress", e =>{
        console.log(e);
    });
    let formData = new FormData(form); // formData is an object to easy send form data
    xhr.send(formData); // sending form data to php
}

