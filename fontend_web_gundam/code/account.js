document.addEventListener("DOMContentLoaded", function () {
    console.log("Account page loaded");

    // Lấy các phần tử DOM
    const ordersSection = document.getElementById("orders-section");
    const addressSection = document.getElementById("address-section");
    const myOrdersBtn = document.getElementById("my-orders");
    const addressBtn = document.getElementById("address-default");

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const saveBtn = document.getElementById("save-btn");

    const firstNameInput = document.getElementById("first-name");
    const addressPhoneInput = document.getElementById("address-phone");
    const addressInput = document.getElementById("address");
    const cityInput = document.getElementById("city");
    const saveAddressBtn = document.getElementById("save-address-btn");
    const editBtn = document.getElementById("edit-btn");

    const logoutBtn = document.querySelector(".logout");

    // Lấy thông tin người dùng hiện tại
    function getLoggedInUser() {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        console.log("Current user:", user);
        return user;
    }

    // Hàm hiển thị HTML cho từng sản phẩm trong đơn hàng
    function getOrderItemsHTML(items) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return '<p>Không có sản phẩm</p>';
        }
        
        let html = '';
        items.forEach(item => {
            console.log("Item:", item);
            
            let priceValue = item.price;
            if (typeof priceValue !== 'number') {
                priceValue = parseInt(priceValue.replace(/\D/g, ""));
            }
            
            html += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <p class="item-name">${item.name}</p>
                        <p class="item-quantity">Số lượng: ${item.quantity}</p>
                        <p class="item-price">${priceValue.toLocaleString()}đ</p>
                    </div>
                </div>
            `;
        });
        return html;
    }

    // Hàm chính để tải và hiển thị đơn hàng
    function loadOrderHistory() {
        console.log("Đang tải lịch sử đơn hàng...");
        
        if (!ordersSection) {
            console.error("Không tìm thấy phần tử orders-section");
            return;
        }
        
        const ordersEmptyDiv = document.querySelector(".orders-empty");
        const userData = getLoggedInUser();
        
        if (!userData || !userData.email) {
            console.log("Không tìm thấy người dùng đã đăng nhập");
            if (ordersEmptyDiv) ordersEmptyDiv.style.display = "block";
            return;
        }
        
        const orderHistoryKey = `orders_${userData.email}`;
        const orderHistory = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
        console.log("Đơn hàng từ localStorage:", orderHistory);
        
        // Xóa container đơn hàng cũ nếu có
        const existingContainer = ordersSection.querySelector(".orders-container");
        if (existingContainer) {
            ordersSection.removeChild(existingContainer);
        }
        
        // Kiểm tra đơn hàng
        if (!orderHistory || orderHistory.length === 0) {
            console.log("Không có đơn hàng nào");
            if (ordersEmptyDiv) ordersEmptyDiv.style.display = "block";
            return;
        }
        
        // Có đơn hàng, ẩn thông báo trống
        if (ordersEmptyDiv) ordersEmptyDiv.style.display = "none";
        
        // Tạo container mới
        const ordersContainer = document.createElement("div");
        ordersContainer.className = "orders-container";
        
        // Hiển thị đơn hàng theo thứ tự mới nhất lên đầu
        orderHistory.reverse().forEach((order, index) => {
            console.log(`Đang xử lý đơn hàng ${index}:`, order);
            
            const orderBox = document.createElement("div");
            orderBox.className = "order-box";
            
            // Tạo HTML cho đơn hàng
            orderBox.innerHTML = `
                <div class="order-header">
                    <div>
                        <h3>Mã đơn hàng: ${order.id || "Unknown"}</h3>
                        <p class="order-date">Ngày đặt: ${order.date}</p>
                    </div>
                    <div class="order-status ${order.status === 'Chờ xác nhận' ? 'pending' : 
                                             order.status === 'Đang giao' ? 'shipping' : 
                                             order.status === 'Hoàn thành' ? 'completed' : ''}">
                        ${order.status || "Đang xử lý"}
                    </div>
                </div>
                <div class="order-address">
                    <p><strong>Địa chỉ giao hàng:</strong> ${order.address}</p>
                </div>
                <div class="order-items-list">
                    ${getOrderItemsHTML(order.items)}
                </div>
                <div class="order-footer">
                    <p class="order-discount">${order.discount && order.discount !== '0' ? 'Giảm giá: ' + order.discount : ''}</p>
                    <p class="order-total">Tổng tiền: ${order.total}</p>
                </div>
            `;
            
            ordersContainer.appendChild(orderBox);
        });
        
        // Thêm container đơn hàng vào section
        ordersSection.appendChild(ordersContainer);
        console.log("Đã hiển thị đơn hàng thành công");
    }

    // Load thông tin tài khoản
    function loadUserInfo() {
        let userData = getLoggedInUser();
        if (userData) {
            nameInput.value = userData.name || "";
            phoneInput.value = userData.phone || "";
            emailInput.value = userData.email || "";
            
            // Load lịch sử đơn hàng
            loadOrderHistory();
        }
    }

    // Load địa chỉ
    function loadAddress() {
        let userData = getLoggedInUser();
        if (userData && userData.email) {
            let savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || {};
            let userAddress = savedAddresses[userData.email];

            if (userAddress) {
                firstNameInput.value = userAddress.firstName || "";
                addressPhoneInput.value = userAddress.phone || "";
                addressInput.value = userAddress.address || "";
                cityInput.value = userAddress.city || "";
            }
        }
    }

    // Thêm event listeners
    if (myOrdersBtn) {
        myOrdersBtn.addEventListener("click", function () {
            console.log("Chuyển đến tab My Orders");
            ordersSection.style.display = "block";
            addressSection.style.display = "none";
            myOrdersBtn.classList.add("active");
            addressBtn.classList.remove("active");
            
            // Tải lại đơn hàng khi chuyển tab
            loadOrderHistory();
        });
    }

    if (addressBtn) {
        addressBtn.addEventListener("click", function () {
            console.log("Chuyển đến tab Address Default");
            ordersSection.style.display = "none";
            addressSection.style.display = "block";
            addressBtn.classList.add("active");
            myOrdersBtn.classList.remove("active");
            
            loadAddress();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            let currentUser = getLoggedInUser();
            if (!currentUser) {
                alert("Bạn cần đăng nhập để lưu thông tin!");
                return;
            }
            
            let updatedUser = {
                ...currentUser,
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput.value
            };

            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            alert("Thông tin đã được cập nhật thành công!");
        });
    }

    if (saveAddressBtn) {
        saveAddressBtn.addEventListener("click", function () {
            let userData = getLoggedInUser();
            if (userData && userData.email) {
                let savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || {};

                savedAddresses[userData.email] = {
                    firstName: firstNameInput.value,
                    phone: addressPhoneInput.value,
                    address: addressInput.value,
                    city: cityInput.value
                };

                localStorage.setItem("userAddresses", JSON.stringify(savedAddresses));
                alert("Địa chỉ đã được lưu thành công!");
            } else {
                alert("Bạn cần đăng nhập để lưu địa chỉ!");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Đăng xuất thành công!");
            window.location.href = "login.html";
        });
    }

    // Khởi tạo trang
    loadUserInfo();
    loadAddress();
});