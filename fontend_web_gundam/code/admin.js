document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to show a specific tab
    window.showTab = function(tabName) {
        // Update navigation active state
        navItems.forEach(item => {
            if (item.dataset.tab === tabName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show the correct tab content
        tabContents.forEach(tab => {
            if (tab.id === tabName + '-tab') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update header title
        document.querySelector('.admin-title').textContent = 
            tabName.charAt(0).toUpperCase() + tabName.slice(1);
    };
    
    // Add click event to navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.tab) {
                e.preventDefault();
                showTab(this.dataset.tab);
            }
        });
    });
    
    // Product form toggle
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product');
    const productForm = document.getElementById('product-form');
    
    if (addProductBtn && cancelProductBtn && productForm) {
        addProductBtn.addEventListener('click', function() {
            productForm.style.display = 'block';
        });
        
        cancelProductBtn.addEventListener('click', function() {
            productForm.style.display = 'none';
        });
    }
    
    // Category form toggle
    const addCategoryBtn = document.getElementById('add-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category');
    const categoryForm = document.getElementById('category-form');
    
    if (addCategoryBtn && cancelCategoryBtn && categoryForm) {
        addCategoryBtn.addEventListener('click', function() {
            categoryForm.style.display = 'block';
        });
        
        cancelCategoryBtn.addEventListener('click', function() {
            categoryForm.style.display = 'none';
        });
    }
    
    // Order details toggle
    const viewOrderBtns = document.querySelectorAll('.btn-primary');
    const orderDetail = document.getElementById('order-detail');
    const closeOrderBtn = document.getElementById('close-order-detail');
    
    if (orderDetail && closeOrderBtn) {
        viewOrderBtns.forEach(btn => {
            if (btn.textContent.trim() === 'View' && btn.closest('#orders-tab')) {
                btn.addEventListener('click', function() {
                    orderDetail.style.display = 'block';
                });
            }
        });
        
        closeOrderBtn.addEventListener('click', function() {
            orderDetail.style.display = 'none';
        });
    }
    
    // User details toggle
    const viewUserBtns = document.querySelectorAll('.btn-primary');
    const userDetail = document.getElementById('user-detail');
    const closeUserBtn = document.getElementById('close-user-detail');
    
    if (userDetail && closeUserBtn) {
        viewUserBtns.forEach(btn => {
            if (btn.textContent.trim() === 'View' && btn.closest('#users-tab')) {
                btn.addEventListener('click', function() {
                    userDetail.style.display = 'block';
                });
            }
        });
        
        closeUserBtn.addEventListener('click', function() {
            userDetail.style.display = 'none';
        });
    }
    
    // Settings tabs
    const settingsTabButtons = document.querySelectorAll('.tab-container .tab-button');
    const settingsTabContents = document.querySelectorAll('.tab-container .tab-content');
    
    settingsTabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Update active state for buttons
            settingsTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected tab content
            settingsTabContents.forEach(content => content.classList.remove('active'));
            settingsTabContents[index].classList.add('active');
        });
    });
    
    // Delete confirmation
    const deleteButtons = document.querySelectorAll('.btn-danger');
    
    deleteButtons.forEach(button => {
        if (button.textContent.trim() === 'Delete') {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        }
    });
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.form-input[placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.admin-card').querySelector('.admin-table');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    
    // Order status update
    const updateButtons = document.querySelectorAll('.btn-success');
    
    updateButtons.forEach(button => {
        if (button.textContent.trim() === 'Update') {
            button.addEventListener('click', function() {
                const statusSelect = document.createElement('select');
                statusSelect.className = 'form-select';
                statusSelect.innerHTML = `
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                `;
                
                const statusCell = this.closest('tr').querySelector('.status-badge').parentNode;
                const currentStatus = this.closest('tr').querySelector('.status-badge').textContent;
                const saveButton = document.createElement('button');
                
                saveButton.className = 'btn btn-primary btn-sm';
                saveButton.textContent = 'Save';
                saveButton.style.marginLeft = '5px';
                
                // Set current status as selected
                Array.from(statusSelect.options).forEach(option => {
                    if (option.textContent === currentStatus) {
                        option.selected = true;
                    }
                });
                
                // Replace status badge with select
                const oldContent = statusCell.innerHTML;
                statusCell.innerHTML = '';
                statusCell.appendChild(statusSelect);
                statusCell.appendChild(saveButton);
                
                // Save button event
                saveButton.addEventListener('click', function() {
                    const newStatus = statusSelect.value;
                    statusCell.innerHTML = `<span class="status-badge status-${newStatus.toLowerCase()}">${newStatus}</span>`;
                    
                    // Show notification
                    alert(`Order status updated to ${newStatus}`);
                });
                
                // Replace update button with cancel
                const cancelButton = document.createElement('button');
                cancelButton.className = 'btn btn-secondary btn-sm';
                cancelButton.textContent = 'Cancel';
                
                const buttonCell = this.parentNode;
                const oldButtons = buttonCell.innerHTML;
                buttonCell.innerHTML = '';
                buttonCell.appendChild(cancelButton);
                
                // Cancel button event
                cancelButton.addEventListener('click', function() {
                    statusCell.innerHTML = oldContent;
                    buttonCell.innerHTML = oldButtons;
                });
            });
        }
    });
    
    // Initialize dashboard stats chart (can be implemented with Chart.js or similar library)
    function initializeCharts() {
        // This is a placeholder for chart initialization
        console.log('Charts would be initialized here');
        
        // Example of how this might look with Chart.js:
        /*
        const ctx = document.getElementById('sales-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: [65000000, 75000000, 62000000, 80000000, 95000000, 120000000],
                    backgroundColor: 'rgba(242, 0, 62, 0.1)',
                    borderColor: '#F2003E',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        */
    }
    
    // Simulate data loading
    function loadDashboardData() {
        // This would typically be an AJAX call to get data from the server
        console.log('Dashboard data would be loaded here');
    }
    
    // Call initialization functions
    loadDashboardData();
    initializeCharts();
    
    // For demo purposes: Update order count every few seconds
    let orderCount = 48;
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of a new order
            orderCount++;
            const orderCountElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
            if (orderCountElement) {
                orderCountElement.textContent = orderCount;
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'admin-notification';
                notification.textContent = 'New order received!';
                document.body.appendChild(notification);
                
                // Remove notification after a few seconds
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        }
    }, 30000); // Every 30 seconds
    
    // Save product form
    const productForms = document.querySelectorAll('.admin-form');
    
    productForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // For demo purposes, just show a success message
            alert('Changes saved successfully!');
            
            // Hide the form if it's a new product/category form
            if (this.closest('#product-form') || this.closest('#category-form')) {
                this.closest('.admin-card').style.display = 'none';
            }
        });
    });
    
    // Data export functionality
    const exportButtons = document.querySelectorAll('.btn-export');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const section = this.dataset.section;
            
            alert(`Exporting ${section} data as ${type}...`);
            // In a real implementation, this would trigger a download
        });
    });
    
    // Bulk action functionality
    const bulkActionSelects = document.querySelectorAll('.bulk-action-select');
    
    bulkActionSelects.forEach(select => {
        select.addEventListener('change', function() {
            const action = this.value;
            
            if (action) {
                const confirmed = confirm(`Are you sure you want to ${action} the selected items?`);
                
                if (confirmed) {
                    alert(`${action} action applied to selected items.`);
                }
                
                // Reset select
                this.value = '';
            }
        });
    });
    
    // Image preview for file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.style.maxWidth = '100px';
                    preview.style.maxHeight = '100px';
                    preview.style.marginTop = '10px';
                    
                    // Remove any existing preview
                    const existingPreview = input.parentNode.querySelector('img');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    
                    input.parentNode.appendChild(preview);
                };
                
                reader.readAsDataURL(file);
            }
        });
    });
});