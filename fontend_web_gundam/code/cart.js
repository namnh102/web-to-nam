document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const totalItemsElement = document.getElementById("total-items");
    const subtotalElement = document.getElementById("subtotal");
    const selectAllCheckbox = document.getElementById("select-all");

    function getCurrentCartKey() {
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        return loggedInUser ? `cart_${loggedInUser.email}` : "cart_guest";
    }

    function loadCart() {
        let cartKey = getCurrentCartKey();
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            updateTotal();
            return;
        }

        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <input type="checkbox" class="select-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">${item.price}</p>
                        <div class="quantity">
                            <button class="minus" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">REMOVE</button>
                    </div>
                </div>
            `;
        });

        addEventListeners();
        updateTotal();
    }

    function updateTotal() {
        let total = 0;
        let itemCount = 0;

        document.querySelectorAll(".cart-item").forEach(item => {
            let checkbox = item.querySelector(".select-item");
            if (checkbox.checked) {
                let price = parseInt(item.querySelector(".item-price").textContent.replace(/\D/g, ""));
                let quantity = parseInt(item.querySelector(".quantity input").value);
                total += price * quantity;
                itemCount += quantity;
            }
        });

        subtotalElement.textContent = total.toLocaleString("vi-VN") + " đ";
        totalPriceElement.textContent = total.toLocaleString("vi-VN") + " đ";
        totalItemsElement.textContent = itemCount;
    }

    function addEventListeners() {
        selectAllCheckbox.addEventListener("change", function () {
            document.querySelectorAll(".select-item").forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateTotal();
        });

        document.querySelectorAll(".select-item").forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                let allChecked = document.querySelectorAll(".select-item:checked").length;
                selectAllCheckbox.checked = (allChecked === document.querySelectorAll(".select-item").length);
                updateTotal();
            });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                let cartKey = getCurrentCartKey();
                let cart = JSON.parse(localStorage.getItem(cartKey));
                cart.splice(index, 1);
                localStorage.setItem(cartKey, JSON.stringify(cart));
                loadCart();
            });
        });

        document.querySelectorAll(".plus, .minus").forEach(button => {
            button.addEventListener("click", function () {
                let cartKey = getCurrentCartKey();
                let cart = JSON.parse(localStorage.getItem(cartKey));
                let index = this.getAttribute("data-index");

                if (this.classList.contains("plus")) {
                    cart[index].quantity = parseInt(cart[index].quantity) + 1;
                } else if (this.classList.contains("minus") && cart[index].quantity > 1) {
                    cart[index].quantity = parseInt(cart[index].quantity) - 1;
                }

                localStorage.setItem(cartKey, JSON.stringify(cart));
                loadCart();
            });
        });
    }
    loadCart();
    // ...existing code...
// Thêm code xử lý nút Checkout
const checkoutBtn = document.querySelector(".checkout-btn");
console.log("Nút Checkout:", checkoutBtn); // Để kiểm tra

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
        console.log("Đã nhấn nút Checkout");
        
        let cartKey = getCurrentCartKey();
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        
        // Lấy các sản phẩm đã chọn
        let selectedItems = [];
        const checkboxes = document.querySelectorAll(".select-item");
        
        // Nếu có checkbox (chọn từng sản phẩm)
        if (checkboxes.length > 0) {
            document.querySelectorAll(".cart-item").forEach((item, index) => {
                const checkbox = item.querySelector(".select-item");
                if (checkbox && checkbox.checked) {
                    selectedItems.push(cart[index]);
                }
            });
            
            if (selectedItems.length === 0) {
                selectedItems = cart; // Nếu không có sản phẩm nào được chọn, lấy tất cả
            }
        } else {
            selectedItems = cart; // Nếu không có hệ thống checkbox, lấy tất cả
        }
        
        // Lưu vào localStorage
        localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
        
        // Chuyển hướng đến trang order
        window.location.href = "order.html?source=cart";
    });
}
});
