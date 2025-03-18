//slide home
let index = 0;
const slideWidth = 890; 
function showSlide() {
  let slides = document.querySelector(".slides");
  slides.style.transform = `translateX(${-index * slideWidth}px)`;
}

function nextSlide() {
  let totalSlides = document.querySelectorAll(".slide").length;
  index = (index + 1) % totalSlides;
  showSlide();
}

function prevSlide() {
  let totalSlides = document.querySelectorAll(".slide").length;
  index = (index - 1 + totalSlides) % totalSlides;
  showSlide();
}
setInterval(nextSlide, 5000);
//new arial
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  let index = 0; // Vị trí hiện tại
  const visibleItems = 4; // Số sản phẩm hiển thị trên 1 trang
  const itemWidth = items[0].offsetWidth + 30; // Lấy chiều rộng của mỗi item (10px margin)

  // Xử lý khi nhấn nút Next
  nextBtn.addEventListener("click", function () {
      if (index < items.length - visibleItems) {
          index++;
          track.style.transform = `translateX(-${index * itemWidth}px)`;
      }
  });
  // Xử lý khi nhấn nút Prev
  prevBtn.addEventListener("click", function () {
      if (index > 0) {
          index--;
          track.style.transform = `translateX(-${index * itemWidth}px)`;
      }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  let cartCount = document.getElementById("cart-count");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
      let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "block" : "none";
  }

  updateCartCount();
});
document.querySelector(".add-to-cart").addEventListener("click", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let product = {
      name: "MG 1/100 GUNDAM ASTRAEA",
      price: 3000000,
      quantity: 1
  };

  let existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct) {
      existingProduct.quantity++;
  } else {
      cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Cập nhật lại số lượng trên icon
});
  // JavaScript cho dropdown menu
  document.addEventListener("DOMContentLoaded", function() {
    // Xử lý cho thiết bị di động
    if (window.innerWidth < 992) {
        const menuLinks = document.querySelectorAll('.title > a');
        
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const dropdown = this.nextElementSibling;
                if (dropdown && dropdown.classList.contains('menu-dropdown')) {
                    e.preventDefault();
                    
                    // Đóng tất cả dropdown đang mở
                    document.querySelectorAll('.menu-dropdown').forEach(menu => {
                        if (menu !== dropdown && menu.style.display === 'block') {
                            menu.style.display = 'none';
                        }
                    });
                    
                    // Hiển thị hoặc ẩn dropdown hiện tại
                    if (dropdown.style.display === 'block') {
                        dropdown.style.display = 'none';
                    } else {
                        dropdown.style.display = 'block';
                    }
                }
            });
        });
        
        // Đóng dropdown khi click bên ngoài
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.title')) {
                document.querySelectorAll('.menu-dropdown').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }
});
// JavaScript cải tiến cho dropdown menu - thêm vào cuối trang
document.addEventListener("DOMContentLoaded", function() {
  const titles = document.querySelectorAll('.title');
  
  titles.forEach(title => {
      let timeout;
      const dropdown = title.querySelector('.menu-dropdown');
      
      if (dropdown) {
          // Khi hover vào title
          title.addEventListener('mouseenter', function() {
              clearTimeout(timeout);
              
              // Đóng tất cả dropdown khác
              document.querySelectorAll('.menu-dropdown').forEach(menu => {
                  if (menu !== dropdown) {
                      menu.style.display = 'none';
                      menu.style.opacity = '0';
                      menu.style.transform = 'translateY(10px)';
                  }
              });
              
              // Hiển thị dropdown hiện tại với hiệu ứng
              dropdown.style.display = 'block';
              setTimeout(() => {
                  dropdown.style.opacity = '1';
                  dropdown.style.transform = 'translateY(0)';
              }, 10);
          });
          
          // Khi hover vào dropdown
          dropdown.addEventListener('mouseenter', function() {
              clearTimeout(timeout);
          });
          
          // Khi rời khỏi title
          title.addEventListener('mouseleave', function(e) {
              if (!dropdown.contains(e.relatedTarget)) {
                  timeout = setTimeout(function() {
                      dropdown.style.opacity = '0';
                      dropdown.style.transform = 'translateY(10px)';
                      
                      // Ẩn dropdown sau khi hiệu ứng hoàn thành
                      setTimeout(() => {
                          if (!title.matches(':hover') && !dropdown.matches(':hover')) {
                              dropdown.style.display = 'none';
                          }
                      }, 300);
                  }, 150);
              }
          });
          
          // Khi rời khỏi dropdown
          dropdown.addEventListener('mouseleave', function(e) {
              if (!title.contains(e.relatedTarget)) {
                  timeout = setTimeout(function() {
                      dropdown.style.opacity = '0';
                      dropdown.style.transform = 'translateY(10px)';
                      
                      // Ẩn dropdown sau khi hiệu ứng hoàn thành
                      setTimeout(() => {
                          dropdown.style.display = 'none';
                      }, 300);
                  }, 150);
              }
          });
      }
  });
  
  // Xử lý cho thiết bị di động
  if (window.innerWidth < 992) {
      const menuLinks = document.querySelectorAll('.title > a');
      
      menuLinks.forEach(link => {
          link.addEventListener('click', function(e) {
              const dropdown = this.parentNode.querySelector('.menu-dropdown');
              if (dropdown) {
                  e.preventDefault();
                  
                  // Đóng tất cả dropdown đang mở
                  document.querySelectorAll('.menu-dropdown').forEach(menu => {
                      if (menu !== dropdown && menu.style.display === 'block') {
                          menu.style.opacity = '0';
                          menu.style.transform = 'translateY(10px)';
                          
                          setTimeout(() => {
                              menu.style.display = 'none';
                          }, 300);
                      }
                  });
                  
                  // Hiển thị hoặc ẩn dropdown hiện tại
                  if (dropdown.style.display === 'block') {
                      dropdown.style.opacity = '0';
                      dropdown.style.transform = 'translateY(10px)';
                      
                      setTimeout(() => {
                          dropdown.style.display = 'none';
                      }, 300);
                  } else {
                      dropdown.style.display = 'block';
                      
                      setTimeout(() => {
                          dropdown.style.opacity = '1';
                          dropdown.style.transform = 'translateY(0)';
                      }, 10);
                  }
              }
          });
      });
      
      // Đóng dropdown khi click bên ngoài
      document.addEventListener('click', function(e) {
          if (!e.target.closest('.title')) {
              document.querySelectorAll('.menu-dropdown').forEach(menu => {
                  menu.style.opacity = '0';
                  menu.style.transform = 'translateY(10px)';
                  
                  setTimeout(() => {
                      menu.style.display = 'none';
                  }, 300);
              });
          }
      });
  }
});