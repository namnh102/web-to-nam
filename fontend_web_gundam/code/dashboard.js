document.addEventListener('DOMContentLoaded', function() {
    initDashboardCharts();
    loadRecentOrders();
});

function initDashboardCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    
    if (!salesCtx) return;
    
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [15000000, 22000000, 18500000, 24000000, 25300000, 28700000, 30100000, 32500000, 35800000, 38200000, 42500000, 45000000],
                borderColor: '#FF0048',
                backgroundColor: 'rgba(255, 0, 72, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return '₫' + value.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) {
                                return '₫' + value / 1000000 + 'M';
                            }
                            return '₫' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Categories Chart
    const categoriesCtx = document.getElementById('categoriesChart');
    
    if (!categoriesCtx) return;
    
    const categoriesChart = new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['MG 1/100', 'HG 1/144', 'PG 1/60', 'SD', 'Accessories'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#FF0048',
                    '#2196F3',
                    '#FFC107',
                    '#4CAF50',
                    '#9C27B0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
    
    // Handle period change
    document.getElementById('sales-period').addEventListener('change', function() {
        const period = this.value;
        
        // Different data for different periods
        let labels, data;
        
        if (period === 'weekly') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [2500000, 3100000, 2800000, 3500000, 4200000, 5100000, 3800000];
        } else if (period === 'yearly') {
            labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
            data = [180000000, 220000000, 280000000, 350000000, 420000000, 500000000];
        } else {
            // Monthly (default)
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [15000000, 22000000, 18500000, 24000000, 25300000, 28700000, 30100000, 32500000, 35800000, 38200000, 42500000, 45000000];
        }
        
        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = data;
        salesChart.update();
    });
}

function loadRecentOrders() {
    const recentOrdersTable = document.getElementById('recent-orders-table');
    
    if (!recentOrdersTable) return;
    
    // Sample data - in a real app, this would come from an API
    const recentOrders = [
        {
            id: 'ORD-123456',
            customer: 'Nguyen Van A',
            date: 'Mar 15, 2025',
            amount: '₫3,800,000',
            status: 'pending'
        },
        {
            id: 'ORD-123455',
            customer: 'Tran Thi B',
            date: 'Mar 14, 2025',
            amount: '₫4,200,000',
            status: 'shipping'
        },
        {
            id: 'ORD-123454',
            customer: 'Le Van C',
            date: 'Mar 14, 2025',
            amount: '₫3,500,000',
            status: 'completed'
        },
        {
            id: 'ORD-123453',
            customer: 'Pham Thi D',
            date: 'Mar 13, 2025',
            amount: '₫7,200,000',
            status: 'completed'
        },
        {
            id: 'ORD-123452',
            customer: 'Hoang Van E',
            date: 'Mar 12, 2025',
            amount: '₫2,900,000',
            status: 'cancelled'
        }
    ];
    
    // Generate table rows
    recentOrdersTable.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.amount}</td>
            <td><span class="status ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
            <td><button class="action-btn view-order" data-id="${order.id}">View</button></td>
        </tr>
    `).join('');
    
    // Add event listeners to view buttons
    recentOrdersTable.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function viewOrderDetails(orderId) {
    // In a real application, you would fetch order details from the server
    // For now, just display the modal with sample data
    
    // Update order ID in modal
    document.getElementById('order-id').textContent = orderId;
    
    // Display the modal
    document.getElementById('order-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load sample order items
    const orderItemsTable = document.getElementById('order-items-table');
    
    const sampleItems = [
        {
            name: 'MG 1/100 GUNDAM ASTRAEA',
            price: '₫3,800,000',
            quantity: 1,
            total: '₫3,800,000'
        }
    ];
    
    orderItemsTable.innerHTML = sampleItems.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
        </tr>
    `).join('');
}