document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const resetPasswordForm = document.getElementById("reset-password-form");
    const emailInput = document.getElementById("email");
    const resetEmail = document.getElementById("reset-email");
    const newPassword = document.getElementById("new-password");
    const confirmNewPassword = document.getElementById("confirm-new-password");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    // Xử lý gửi yêu cầu đặt lại mật khẩu
    forgotPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
        const email = emailInput.value.trim();
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Kiểm tra email có tồn tại không
        let user = users.find(user => user.email === email);
        if (!user) {
            errorMessage.textContent = "Email not found.";
            return;
        }

        // Ẩn form nhập email, hiển thị form nhập mật khẩu mới
        forgotPasswordForm.style.display = "none";
        resetPasswordForm.style.display = "block";
        resetEmail.value = email; // Giữ email để cập nhật mật khẩu mới
    });

    // Xử lý cập nhật mật khẩu mới
    resetPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = resetEmail.value;
        const password = newPassword.value.trim();
        const confirmPassword = confirmNewPassword.value.trim();
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Kiểm tra mật khẩu hợp lệ
        if (!password || !confirmPassword) {
            errorMessage.textContent = "Please fill in all fields.";
            return;
        }
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match.";
            return;
        }

        // Cập nhật mật khẩu mới
        users = users.map(user => {
            if (user.email === email) {
                user.password = password; // Đặt lại mật khẩu
            }
            return user;
        });

        // Lưu lại vào localStorage
        localStorage.setItem("users", JSON.stringify(users));
        successMessage.textContent = "Password reset successful! Please log in.";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
});

