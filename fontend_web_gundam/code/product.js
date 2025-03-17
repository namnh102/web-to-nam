document.addEventListener("DOMContentLoaded", function () {
    // Lấy danh sách ảnh nhỏ và ảnh chính
    const thumbnails = document.querySelectorAll(".thumbnail-list img");
    const mainImage = document.getElementById("main-image");

    // Lấy các nút chuyển ảnh
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    // Lấy input số lượng và các nút tăng/giảm
    const quantityInput = document.getElementById("quantity");

    let currentIndex = 0; // Chỉ mục của ảnh hiện tại

    function changeImage(element) {
        mainImage.src = element.src;
        currentIndex = Array.from(thumbnails).indexOf(element);

        thumbnails.forEach((img) => img.style.border = "2px solid transparent");
        element.style.border = "2px solid red";
    }

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", function () {
            changeImage(this);
        });
    });

    function updateImageByIndex(index) {
        currentIndex = index;
        mainImage.src = thumbnails[currentIndex].src;

        thumbnails.forEach((img) => img.style.border = "2px solid transparent");
        thumbnails[currentIndex].style.border = "2px solid red";
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateImageByIndex(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateImageByIndex(currentIndex);
    });

    changeImage(thumbnails[0]);

    function increaseQuantity() {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }

    function decreaseQuantity() {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    }

    document.querySelector(".quantity button:nth-child(1)").addEventListener("click", decreaseQuantity);
    document.querySelector(".quantity button:nth-child(3)").addEventListener("click", increaseQuantity);

    const sliderWrapper = document.querySelector(".slider-wrapper");
    const prevButton = document.querySelector(".btn-left");
    const nextButton = document.querySelector(".btn-right");

    let index = 0;
    const slides = document.querySelectorAll(".slider-item");
    const totalSlides = slides.length;
    const slideWidth = slides[0].offsetWidth + 15;
    const visibleSlides = 4;

    function updateSliderPosition() {
        sliderWrapper.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    nextButton.addEventListener("click", function () {
        index = (index < totalSlides - visibleSlides) ? index + 1 : 0;
        updateSliderPosition();
    });

    prevButton.addEventListener("click", function () {
        index = (index > 0) ? index - 1 : totalSlides - visibleSlides;
        updateSliderPosition();
    });

    const addToCartBtn = document.querySelector(".add-to-cart");
    
    function getCurrentCartKey() {
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        return loggedInUser ? `cart_${loggedInUser.email}` : "cart_guest";
    }

    addToCartBtn.addEventListener("click", function () {
        const productName = document.querySelector(".product-info h1").innerText;
        const productPrice = document.querySelector(".price").innerText;
        const productImage = document.getElementById("main-image").src;
        const quantity = document.getElementById("quantity").value;

        const cartKey = getCurrentCartKey();
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity);
        } else {
            cart.push({ name: productName, price: productPrice, image: productImage, quantity });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        function showCartToast() {
            const toast = document.getElementById("cart-toast");
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.add("hide");
            }, 2500);

            setTimeout(() => {
                toast.classList.remove("show", "hide");
            }, 3000);
        }

        showCartToast();
    });
// ...existing code...

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
    
    const orderContainer = document.querySelector(".order-summary");
    let total = 0;
    let itemCount = 0;

    orderContainer.innerHTML = "";
    
    if (orderItems.length === 0) {
        orderContainer.innerHTML = "<p>No items in your order.</p>";
        document.getElementById("total-price").innerText = "0đ";
        return;
    }
    
    orderItems.forEach(item => {
        // Make sure price is a number
        const itemPrice = typeof item.price === 'number' ? 
                          item.price : 
                          parseInt(item.price.replace(/\D/g, ""));
                          
        const itemQuantity = parseInt(item.quantity);
        total += itemPrice * itemQuantity;
        itemCount += itemQuantity;
        
        orderContainer.innerHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <p>Qty: ${itemQuantity}</p>
                <p>${itemPrice.toLocaleString()}đ</p>
            </div>
        `;
    });
    
    document.getElementById("total-price").innerText = total.toLocaleString() + "đ";
    document.getElementById("item-count").innerText = itemCount;
}

// Add this helper function to ensure consistency
function getCurrentCartKey() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? `cart_${loggedInUser.email}` : "cart_guest";
}

function placeOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    // Process the order
    if (source === 'buynow') {
        localStorage.removeItem("buyNowItem");
    } else if (source === 'cart') {
        localStorage.removeItem("checkoutItems");
        
        // Also remove selected items from the cart
        const cartKey = getCurrentCartKey();
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
        
        // Filter out checked out items
        const newCart = cart.filter(cartItem => {
            return !checkoutItems.some(checkoutItem => 
                checkoutItem.name === cartItem.name && 
                checkoutItem.image === cartItem.image
            );
        });
        
        localStorage.setItem(cartKey, JSON.stringify(newCart));
    } else {
        // Regular cart checkout (for backward compatibility)
        const cartKey = getCurrentCartKey();
        localStorage.removeItem(cartKey);
    }
    
    alert("Order placed successfully!");
    window.location.href = "account.html";
}
const buyNowBtn = document.querySelector(".buy-now");
    console.log("Nút Buy Now:", buyNowBtn); // Để kiểm tra

    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            console.log("Đã nhấn nút Buy Now");
            
            // Lấy thông tin sản phẩm
            const productName = document.querySelector(".product-info h1").innerText;
            const productPrice = document.querySelector(".price").innerText;
            const productImage = document.getElementById("main-image").src;
            const quantity = document.getElementById("quantity").value;
            
            // Tạo đối tượng sản phẩm mua ngay
            const buyNowItem = [{
                name: productName,
                price: parseInt(productPrice.replace(/[^\d]/g, "")), 
                image: productImage,
                quantity: parseInt(quantity)
            }];
            
            // Lưu vào localStorage
            localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
            
            // Chuyển hướng đến trang order
            window.location.href = "order.html?source=buynow";
        });
    }
});