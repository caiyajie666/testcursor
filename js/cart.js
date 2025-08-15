// 购物车页面功能

let cart = [];
let selectedItems = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderCart();
    updateOrderSummary();
    loadRecommendedProducts();
    updateCartCount();
});

// 加载购物车数据
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    selectedItems = cart.map(item => item.id); // 默认全选
}

// 渲染购物车
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartContainer.appendChild(cartItem);
    });
    
    updateSelectAllStatus();
}

// 创建购物车商品项
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    const discountPercent = Math.round((1 - item.price / item.originalPrice) * 100);
    const isSelected = selectedItems.includes(item.id);
    
    cartItem.innerHTML = `
        <div class="row align-items-center">
            <div class="col-auto">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleItemSelection(${item.id})">
                </div>
            </div>
            <div class="col-auto">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            </div>
            <div class="col">
                <div class="row">
                    <div class="col-md-8">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted small mb-1">${item.description}</p>
                        <div class="mb-1">
                            <span class="badge bg-primary">${item.brand}</span>
                            <span class="badge bg-danger ms-1">-${discountPercent}%</span>
                        </div>
                        <div class="product-rating">
                            ${generateStars(item.rating)}
                            <small class="text-muted ms-1">(${item.reviews} 评价)</small>
                        </div>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="mb-2">
                            <div class="product-price">¥${item.price.toLocaleString()}</div>
                            <small class="product-original-price">¥${item.originalPrice.toLocaleString()}</small>
                        </div>
                        <div class="d-flex align-items-center justify-content-end mb-2">
                            <button class="btn quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control quantity-input mx-2" 
                                   value="${item.quantity}" min="1" max="99"
                                   onchange="updateQuantity(${item.id}, this.value)">
                            <button class="btn quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="d-flex gap-2 justify-content-end">
                            <button class="btn btn-sm btn-outline-secondary" onclick="moveToWishlist(${item.id})" title="移到心愿单">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})" title="删除">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return cartItem;
}

// 切换商品选择状态
function toggleItemSelection(itemId) {
    const index = selectedItems.indexOf(itemId);
    
    if (index > -1) {
        selectedItems.splice(index, 1);
    } else {
        selectedItems.push(itemId);
    }
    
    updateSelectAllStatus();
    updateOrderSummary();
    updateCheckoutButton();
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const isChecked = selectAllCheckbox.checked;
    
    if (isChecked) {
        selectedItems = cart.map(item => item.id);
    } else {
        selectedItems = [];
    }
    
    // 更新所有商品的选择状态
    document.querySelectorAll('.cart-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    updateOrderSummary();
    updateCheckoutButton();
}

// 更新全选状态
function updateSelectAllStatus() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const totalItems = cart.length;
    const selectedCount = selectedItems.length;
    
    if (selectedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (selectedCount === totalItems) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// 更新商品数量
function updateQuantity(itemId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    if (newQuantity > 99) {
        showToast('商品数量不能超过99件', 'error');
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 更新数量输入框
        const quantityInput = document.querySelector(`[data-id="${itemId}"] .quantity-input`);
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }
        
        updateOrderSummary();
        updateCartCount();
        showToast('已更新商品数量', 'success');
    }
}

// 从购物车移除商品
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        // 从选中列表中移除
        const selectedIndex = selectedItems.indexOf(itemId);
        if (selectedIndex > -1) {
            selectedItems.splice(selectedIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 移除DOM元素
        const cartItemElement = document.querySelector(`[data-id="${itemId}"]`);
        if (cartItemElement) {
            cartItemElement.remove();
        }
        
        renderCart();
        updateOrderSummary();
        updateCartCount();
        showToast(`已从购物车移除 ${item.name}`, 'info');
    }
}

// 移到心愿单
function moveToWishlist(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    // 添加到心愿单
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.includes(itemId)) {
        wishlist.push(itemId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    // 从购物车移除
    removeFromCart(itemId);
    showToast('商品已移到心愿单', 'success');
}

// 删除选中商品
function deleteSelected() {
    if (selectedItems.length === 0) {
        showToast('请先选择要删除的商品', 'error');
        return;
    }
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// 确认删除
function confirmDelete() {
    selectedItems.forEach(itemId => {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        }
    });
    
    selectedItems = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    updateOrderSummary();
    updateCartCount();
    
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
    
    showToast('已删除选中的商品', 'success');
}

// 更新订单摘要
function updateOrderSummary() {
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('subtotal').textContent = `¥${subtotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    
    // 获取配送费用
    const shippingCost = getShippingCost();
    document.getElementById('shipping').textContent = shippingCost === 0 ? '免费' : `¥${shippingCost.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    
    // 获取优惠券折扣
    const discount = getDiscountAmount(subtotal);
    document.getElementById('discount').textContent = discount > 0 ? `-¥${discount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : '-¥0.00';
    
    // 计算总金额
    const total = Math.max(0, subtotal + shippingCost - discount);
    document.getElementById('total').textContent = `¥${total.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    
    updateCheckoutButton();
}

// 获取配送费用
function getShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (!selectedShipping) return 0;
    
    switch (selectedShipping.value) {
        case 'express': return 15;
        case 'same-day': return 25;
        default: return 0; // 标准配送免费
    }
}

// 获取优惠券折扣金额
function getDiscountAmount(subtotal) {
    // 这里可以根据优惠券代码计算折扣
    // 目前返回固定折扣作为示例
    const appliedCoupon = sessionStorage.getItem('appliedCoupon');
    if (appliedCoupon === 'SAVE10') {
        return Math.min(subtotal * 0.1, 100); // 9折优惠，最高优惠100元
    } else if (appliedCoupon === 'FIRST20') {
        return Math.min(subtotal * 0.2, 50); // 8折优惠，最高优惠50元
    }
    return 0;
}

// 更新配送方式
function updateShipping() {
    updateOrderSummary();
}

// 应用优惠券
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    if (!couponCode) {
        showToast('请输入优惠券代码', 'error');
        return;
    }
    
    // 模拟优惠券验证
    const validCoupons = {
        'SAVE10': { name: '新用户9折优惠', discount: 0.1, maxDiscount: 100 },
        'FIRST20': { name: '首单8折优惠', discount: 0.2, maxDiscount: 50 },
        'FREE15': { name: '免配送费', type: 'shipping' }
    };
    
    const coupon = validCoupons[couponCode];
    
    if (coupon) {
        sessionStorage.setItem('appliedCoupon', couponCode);
        sessionStorage.setItem('appliedCouponName', coupon.name);
        
        if (coupon.type === 'shipping') {
            // 设置为标准配送（免费）
            document.getElementById('standardShipping').checked = true;
        }
        
        updateOrderSummary();
        showToast(`优惠券 "${coupon.name}" 已应用`, 'success');
        
        // 清空输入框
        document.getElementById('couponCode').value = '';
    } else {
        showToast('无效的优惠券代码', 'error');
    }
}

// 更新结算按钮状态
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const hasSelectedItems = selectedItems.length > 0;
    
    checkoutBtn.disabled = !hasSelectedItems;
    
    if (hasSelectedItems) {
        const selectedCount = selectedItems.length;
        checkoutBtn.innerHTML = `<i class="fas fa-credit-card me-2"></i>去结算 (${selectedCount})`;
    } else {
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>去结算';
    }
}

// 进入结算流程
function proceedToCheckout() {
    if (selectedItems.length === 0) {
        showToast('请选择要结算的商品', 'error');
        return;
    }
    
    // 保存选中的商品到结算信息
    const checkoutItems = cart.filter(item => selectedItems.includes(item.id));
    sessionStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
    
    // 这里可以跳转到结算页面
    showToast('跳转到结算页面...', 'info');
    
    // 模拟跳转延迟
    setTimeout(() => {
        alert('结算功能开发中...\n\n选中商品：' + checkoutItems.map(item => `${item.name} x${item.quantity}`).join('\n'));
    }, 1000);
}

// 加载推荐商品
function loadRecommendedProducts() {
    const container = document.getElementById('recommendedProducts');
    
    // 模拟推荐商品数据
    const recommendedProducts = [
        {
            id: 101,
            name: "无线耳机",
            price: 299,
            originalPrice: 399,
            image: "https://via.placeholder.com/150x100/007bff/ffffff?text=Earphones",
            rating: 4.5
        },
        {
            id: 102,
            name: "手机壳",
            price: 59,
            originalPrice: 89,
            image: "https://via.placeholder.com/150x100/28a745/ffffff?text=Phone+Case",
            rating: 4.3
        },
        {
            id: 103,
            name: "充电宝",
            price: 199,
            originalPrice: 249,
            image: "https://via.placeholder.com/150x100/ffc107/000000?text=Power+Bank",
            rating: 4.6
        }
    ];
    
    container.innerHTML = '';
    
    recommendedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card mb-3';
        productCard.style.maxWidth = '250px';
        
        productCard.innerHTML = `
            <div class="row g-0">
                <div class="col-4">
                    <img src="${product.image}" class="img-fluid rounded-start" alt="${product.name}">
                </div>
                <div class="col-8">
                    <div class="card-body p-2">
                        <h6 class="card-title small">${product.name}</h6>
                        <div class="product-rating small">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="mt-1">
                            <span class="text-danger fw-bold small">¥${product.price}</span>
                            <small class="text-muted text-decoration-line-through ms-1">¥${product.originalPrice}</small>
                        </div>
                        <button class="btn btn-primary btn-sm mt-1" onclick="addRecommendedToCart(${product.id})">
                            加入购物车
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// 添加推荐商品到购物车
function addRecommendedToCart(productId) {
    showToast('推荐商品添加功能开发中...', 'info');
}

// 更新购物车数量
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// 复用函数
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0`;
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// 搜索商品功能（复用）
function searchProducts(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (searchTerm) {
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// 导出全局函数
window.toggleItemSelection = toggleItemSelection;
window.toggleSelectAll = toggleSelectAll;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.moveToWishlist = moveToWishlist;
window.deleteSelected = deleteSelected;
window.confirmDelete = confirmDelete;
window.updateShipping = updateShipping;
window.applyCoupon = applyCoupon;
window.proceedToCheckout = proceedToCheckout;
window.addRecommendedToCart = addRecommendedToCart;
window.searchProducts = searchProducts;