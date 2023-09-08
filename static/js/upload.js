const form = document.querySelector("form"),
fileInput = form.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", ()=>{
    fileInput.click();
});

fileInput.onchange = ({target}) =>{
    let file = target.files[0] // getting file and [0] this means if user has selected multiplies files then get first one only
    if (file){ // if url is selected
        let fileName = file.name; // getting selected file name
        if (fileName.length >= 12) { // if filename is greater or equal 12 
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 12) + "... ." + splitName[1];
        }
        uploadFIle(fileName); // calling uploadFile with passing file name as an argument
    }
}

function uploadFIle(name) {
    let xhr = new XMLHttpRequest(); // creating new xml object (AJAX)
    xhr.open("POST", "/upload"); // sending post request to the specified url
    xhr.upload.addEventListener("progress", ({loaded, total}) =>{
        let fileLoaded = Math.floor((loaded / total * 100)); // getting percentage of loaded file size
        let fileTotal = Math.floor((total / 1024)) // getting file size in MB from bytes
        let fileSize;
        // if file size is less than 1024 then add only KB else convert size to MB
        (fileTotal < 1024) ? fileSize = (fileTotal + " KB"): fileSize = ((loaded / (1024 * 1024)).toFixed(2) + " MB");
        let progressHTML = `<li class="row">
                                <i class="fas fa-file-alt"></i>
                                <div class="content">
                                <div class="details">
                                    <span class="name">${name} * Uploading</span>
                                    <span class="percent">${fileLoaded}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${fileLoaded}%"></div>
                                </div>
                                </div>
                            </li>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
                                    <div class="content">
                                    <i class="fas fa-file-alt"></i>
                                    <div class="details">
                                        <span class="name">${name} * Uploaded</span>
                                        <span class="size">${fileSize}</span>
                                    </div>
                                    </div>
                                    <i class="fas fa-check"></i>
                                </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        };
    });
    let formData = new FormData(form); // formData is an object to easy send form data
    xhr.send(formData); // sending form data to flask
}
