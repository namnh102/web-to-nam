document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    displayOrderSummary();
    loadUserInfo();

    const addressDefaultBtn = document.getElementById("address-default");
    const saveAddressBtn = document.getElementById("save-address-btn");
    const orderBtn = document.getElementById("order-btn");
    const applyCouponBtn = document.getElementById("apply-coupon");

    if (addressDefaultBtn) {
        addressDefaultBtn.addEventListener("click", function () {
            console.log("Address Default clicked");
            autoFillAddress();
        });
    }

    if (saveAddressBtn) {
        saveAddressBtn.addEventListener("click", saveAddress);
    }

    if (orderBtn) {
        orderBtn.addEventListener("click", placeOrder);
    }
    
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener("click", applyCoupon);
    }
});

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User data from localStorage:", user);

    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("user-account").style.display = "block";

        const addressDefault = document.getElementById("address-default");
        if (addressDefault) {
            addressDefault.style.display = "block";
        }
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("user-account").style.display = "none";

        const addressDefault = document.getElementById("address-default");
        if (addressDefault) {
            addressDefault.style.display = "none";
        }
    }
}

function loadUserInfo() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData) {
        const firstNameInput = document.getElementById("first-name");
        const addressPhoneInput = document.getElementById("address-phone");
        
        if (firstNameInput && userData.name) {
            firstNameInput.value = userData.name;
        }
        
        if (addressPhoneInput && userData.phone) {
            addressPhoneInput.value = userData.phone;
        }
    }
}

function autoFillAddress() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData && userData.email) {
        let savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || {};
        let userAddress = savedAddresses[userData.email];
        
        if (userAddress) {
            document.getElementById("first-name").value = userAddress.firstName || "";
            document.getElementById("address-phone").value = userAddress.phone || "";
            document.getElementById("address").value = userAddress.address || "";
            document.getElementById("city").value = userAddress.city || "";
        } else {
            alert("No saved address found!");
        }
    }
}

function saveAddress() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData && userData.email) {
        let savedAddresses = JSON.parse(localStorage.getItem("userAddresses")) || {};

        savedAddresses[userData.email] = {
            firstName: document.getElementById("first-name").value,
            phone: document.getElementById("address-phone").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value
        };

        localStorage.setItem("userAddresses", JSON.stringify(savedAddresses));
        alert("Address saved successfully!");
    } else {
        alert("You must be logged in to save an address!");
    }
}

function getCurrentCartKey() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? `cart_${loggedInUser.email}` : "cart_guest";
}

function displayOrderSummary() {
    // Check source: buynow or cart
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    let orderItems = [];
    
    if (source === 'buynow') {
        // Get items from buy now
        orderItems = JSON.parse(localStorage.getItem("buyNowItem")) || [];
    } else if (source === 'cart') {
        // Get selected items from cart checkout
        orderItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    } else {
        // Fallback to regular cart (for backward compatibility)
        const cartKey = getCurrentCartKey();
        orderItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    }
    
    const orderItemsContainer = document.getElementById("order-items");
    const totalItemsElement = document.getElementById("total-items");
    const totalPriceElement = document.getElementById("total-price");
    const subtotalElement = document.getElementById("subtotal");
    
    let total = 0;
    let itemCount = 0;

    orderItemsContainer.innerHTML = "";
    
    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = "<p>No items in your order.</p>";
        subtotalElement.innerText = "0đ";
        totalPriceElement.innerText = "0đ";
        totalItemsElement.innerText = "0";
        return;
    }
    
    orderItems.forEach(item => {
        // Make sure price is a number
        let priceValue = item.price;
        if (typeof priceValue !== 'number') {
            priceValue = parseInt(priceValue.replace(/\D/g, ""));
        }
        
        const itemQuantity = parseInt(item.quantity);
        total += priceValue * itemQuantity;
        itemCount += itemQuantity;
        
        orderItemsContainer.innerHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <p class="item-name">${item.name}</p>
                    <p>Quantity: ${itemQuantity}</p>
                    <p class="item-price">${priceValue.toLocaleString()}đ</p>
                </div>
            </div>
        `;
    });
    
    subtotalElement.innerText = total.toLocaleString() + "đ";
    totalPriceElement.innerText = total.toLocaleString() + "đ";
    totalItemsElement.innerText = itemCount;
}

function applyCoupon() {
    const couponCode = document.getElementById("coupon").value;
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const totalPriceElement = document.getElementById("total-price");
    
    if (!couponCode) {
        alert("Please enter a coupon code");
        return;
    }
    
    // Example coupon codes and their discount percentages
    const coupons = {
        "WELCOME10": 10,
        "SALE20": 20,
        "VIP50": 50
    };
    
    if (coupons[couponCode]) {
        const discountPercent = coupons[couponCode];
        const subtotal = parseInt(subtotalElement.innerText.replace(/\D/g, ""));
        const discountAmount = Math.round((subtotal * discountPercent) / 100);
        const newTotal = subtotal - discountAmount;
        
        discountElement.innerText = `-${discountAmount.toLocaleString()}đ (${discountPercent}%)`;
        totalPriceElement.innerText = newTotal.toLocaleString() + "đ";
        
        alert(`Coupon "${couponCode}" applied! You saved ${discountAmount.toLocaleString()}đ`);
    } else {
        alert("Invalid coupon code");
    }
}
function placeOrder() {
    // Kiểm tra form
    const firstName = document.getElementById("first-name").value;
    const phone = document.getElementById("address-phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    
    if (!firstName || !phone || !address || !city) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng");
        return;
    }
    
    // Kiểm tra nguồn đơn hàng
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    console.log("Source đơn hàng:", source);
    
    // Lấy dữ liệu đơn hàng
    let orderItems = [];
    if (source === 'buynow') {
        orderItems = JSON.parse(localStorage.getItem("buyNowItem")) || [];
        console.log("Sản phẩm mua ngay:", orderItems);
        localStorage.removeItem("buyNowItem");
    } else if (source === 'cart') {
        orderItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
        console.log("Sản phẩm từ giỏ hàng:", orderItems);
        
        // Cập nhật giỏ hàng
        if (orderItems.length > 0) {
            const cartKey = getCurrentCartKey();
            const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
            
            const updatedCart = currentCart.filter(cartItem => 
                !orderItems.some(checkoutItem => 
                    checkoutItem.name === cartItem.name
                )
            );
            
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            localStorage.removeItem("checkoutItems");
        }
    } else {
        const cartKey = getCurrentCartKey();
        orderItems = JSON.parse(localStorage.getItem(cartKey)) || [];
        localStorage.setItem(cartKey, JSON.stringify([]));
    }
    
    if (orderItems.length === 0) {
        alert("Không có sản phẩm nào trong đơn hàng!");
        return;
    }
    
    // Kiểm tra người dùng đăng nhập
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Lấy thông tin giá
    const totalPrice = document.getElementById("total-price").innerText;
    const discountText = document.getElementById("discount").innerText;
    
    if (user && user.email) {
        console.log("Đang lưu đơn hàng cho user:", user.email);
        
        // Tạo đơn hàng mới
        const orderData = {
            id: "ORDER" + Date.now().toString().slice(-6),
            items: orderItems,
            total: totalPrice,
            discount: discountText,
            date: new Date().toLocaleString("vi-VN"),
            address: `${firstName}, ${phone}, ${address}, ${city}`,
            status: "Chờ xác nhận"
        };
        
        console.log("Đơn hàng mới:", orderData);
        
        // Lưu vào localStorage
        const orderHistoryKey = `orders_${user.email}`;
        let orderHistory = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
        orderHistory.push(orderData);
        localStorage.setItem(orderHistoryKey, JSON.stringify(orderHistory));
        
        console.log("Đã lưu đơn hàng:", orderHistory);
        
        alert("Đặt hàng thành công!\nBạn có thể xem đơn hàng trong phần 'My Orders'");
        window.location.href = "account.html";
    } else {
        alert("Đặt hàng thành công!");
        window.location.href = "index.html";
    }
}