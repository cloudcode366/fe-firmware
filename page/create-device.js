document.getElementById('deviceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const deviceName = document.getElementById('deviceName').value;

    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('name', deviceName);

    // Gửi yêu cầu POST tới API create-device
    fetch('https://uploadfirmwareserver.onrender.com/api/v1/storage/create-device', {
        method: 'POST',
        body: formData, // Gửi dữ liệu dưới dạng form data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Chuyển đổi phản hồi sang JSON
    })
    .then(data => {
        const message = `Device created successfully! ID: ${data.id}`;
        // document.getElementById('deviceResponse').innerText = message;
        document.getElementById('deviceName').value = ""; // Reset form
        document.getElementById('deviceId').value = data.id;
    })
    .catch(error => {
        document.getElementById('deviceResponse').innerText = 'Device creation failed: ' + error.message;
    });
});
document.getElementById('copyButton').addEventListener('click', function() {
    const deviceIdInput = document.getElementById('deviceId');

    // Sử dụng Clipboard API để sao chép vào clipboard
    navigator.clipboard.writeText(deviceIdInput.value)
        .then(() => {
            // Thông báo sao chép thành công
            showToast('Device ID copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy Device ID.');
        });
});

// Hàm hiển thị toast thông báo
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Hiển thị toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Delay nhỏ để hiệu ứng bắt đầu

    // Ẩn toast sau 2 giây
    setTimeout(() => {
        toast.classList.remove('show');
        // Xóa toast khỏi container sau khi ẩn
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300); // Chờ hiệu ứng ẩn hoàn tất
    }, 2000); // 2 giây
}

document.addEventListener('DOMContentLoaded', function() {
    // Lấy tất cả các input có type là text và reset giá trị của chúng
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        input.value = ''; // Reset giá trị của input
    });
});