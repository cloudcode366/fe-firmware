document.getElementById('firmwareForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const formData = new FormData(this);
    
    fetch('http://localhost:8080/api/v1/storage/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('responseMessage').innerText = 'Upload successful: ' + data;
    })
    .catch(error => {
        document.getElementById('responseMessage').innerText = 'Upload failed: ' + error.message;
    });
});
