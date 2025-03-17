document.addEventListener("DOMContentLoaded", function () {
    // Đăng ký tài khoản
    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            let email = document.getElementById("reg-email").value;
            let phone = document.getElementById("reg-phone").value;
            let password = document.getElementById("reg-password").value;
            let confirmPassword = document.getElementById("reg-confirm-password").value;
            let errorMsg = document.getElementById("register-error");

            // Kiểm tra hợp lệ
            if (!email || !phone || !password || !confirmPassword) {
                errorMsg.textContent = "Please fill in all fields.";
                return;
            }
            if (password !== confirmPassword) {
                errorMsg.textContent = "Passwords do not match.";
                return;
            }

            // Kiểm tra xem email đã đăng ký chưa
            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.email === email)) {
                errorMsg.textContent = "Email already exists.";
                return;
            }

            // Lưu vào localStorage
            users.push({ email, phone, password });
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem(`cart_${email}`, JSON.stringify([]));

            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        });
    }

    // Đăng nhập
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            let email = document.getElementById("login-email").value;
            let password = document.getElementById("login-password").value;
            let errorMsg = document.getElementById("login-error");

            let users = JSON.parse(localStorage.getItem("users")) || [];
            let user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                errorMsg.textContent = "Invalid email or password.";
                return;
            }

            // Lưu trạng thái đăng nhập
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            let cartKey = `cart_${user.email}`;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            localStorage.setItem("cart", JSON.stringify(cart)); //

            alert("Login successful!");
            window.location.href = "index.html"; // Điều hướng sau khi đăng nhập thành công
        });
    }

    // Kiểm tra trạng thái đăng nhập
    const authContainer = document.getElementById("auth-container");
    const userAccount = document.getElementById("user-account");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        authContainer.style.display = "none"; // Ẩn Sign in & Register
        userAccount.style.display = "flex"; // Hiển thị My Account
    }
});
