// Hàm để tải danh sách thiết bị vào dropdown
function loadDevices() {
    fetch('https://uploadfirmwareserver.onrender.com/api/v1/storage/get-all-deivce', {
        method: 'GET',
        mode: 'cors',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const deviceSelect = document.getElementById('deviceSelect');
        const deviceSelectFirmware = document.getElementById('deviceSelectFirmware');
        
        deviceSelect.innerHTML = ''; // Xóa các option cũ
        deviceSelectFirmware.innerHTML = ''; // Xóa các option cũ

        // Thêm option mặc định cho cả 2 dropdown
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = 'Select a device';
        
        deviceSelect.appendChild(defaultOption);
        deviceSelectFirmware.appendChild(defaultOption.cloneNode(true));

        // Thêm danh sách thiết bị vào cả hai dropdown
        data.forEach(device => {
            const option = document.createElement('option');
            option.value = device.id; // Giá trị là ID của thiết bị
            option.textContent = device.name; // Hiển thị tên của thiết bị

            deviceSelect.appendChild(option);
            deviceSelectFirmware.appendChild(option.cloneNode(true));
        });
    })
    .catch(error => {
        alert('Failed to load devices: ' + error.message); // Hiển thị thông báo lỗi
    });
}

// Gọi hàm loadDevices khi trang tải
document.addEventListener('DOMContentLoaded', loadDevices);

// Xử lý sự kiện "Get Latest Version"
document.getElementById('getLatestVersionButton').addEventListener('click', function () {
    const selectedDeviceId = document.getElementById('deviceSelectFirmware').value;

    if (!selectedDeviceId) {
        showToast('Please select a device.');
        return;
    }

    // Gửi yêu cầu đến API để lấy phiên bản firmware mới nhất của thiết bị
    fetch(`https://uploadfirmwareserver.onrender.com/api/v1/update/latest/${selectedDeviceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            // Nếu response không hợp lệ, trả về lỗi
            throw new Error('Failed to fetch firmware version: ' + response.statusText);
        }

        // Kiểm tra xem phản hồi có nội dung hay không
        return response.text().then(text => {
            if (text) {
                try {
                    const data = JSON.parse(text); // Chuyển đổi thành JSON
                    if (data.firmwareVersion) {
                        // Nếu có firmware version, hiển thị thông báo
                        showToast(`Latest firmware version: ${data.firmwareVersion}`);
                    } else {
                        // Nếu không có firmware, hiển thị thông báo tương ứng
                        showToast("Don't have firmware");
                    }
                } catch (e) {
                    // Nếu JSON không hợp lệ
                    showToast("Error: Invalid JSON response");
                }
            } else {
                // Nếu không có nội dung trả về
                showToast("No firmware available for this device.");
            }
        });
    })
    .catch(error => {
        console.error(error);
        showToast("Failed to fetch firmware version: " + error.message);
    });
});

// Xử lý sự kiện submit của form
document.getElementById('firmwareForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const formData = new FormData(this); // Lấy dữ liệu từ form
    const selectedDeviceId = document.getElementById('deviceSelect').value; // Lấy ID thiết bị từ dropdown

    if (!selectedDeviceId) {
        showToast('Please select a device.');
        return;
    }

    fetch(`https://uploadfirmwareserver.onrender.com/api/v1/storage/upload/${selectedDeviceId}`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text(); // API trả về chuỗi phản hồi
    })
    .then(data => {
        showToast('Upload successful');
        document.getElementById('firmwareForm').reset(); // Reset form
    })
    .catch(error => {
        showToast('Upload failed: ' + error.message);
    });
});

// Hàm hiển thị toast
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
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300); // Chờ hiệu ứng ẩn hoàn tất
    }, 7000); // 2 giây
}
