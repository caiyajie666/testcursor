// 主页JavaScript功能

// 模拟商品数据
const featuredProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 7999,
        originalPrice: 8999,
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=iPhone+15+Pro",
        category: "electronics",
        rating: 4.8,
        reviews: 1250,
        brand: "apple",
        description: "最新一代iPhone，配备A17 Pro芯片"
    },
    {
        id: 2,
        name: "Nike Air Max 270",
        price: 899,
        originalPrice: 1199,
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Nike+Air+Max",
        category: "sports",
        rating: 4.6,
        reviews: 856,
        brand: "nike",
        description: "舒适透气的运动鞋，适合日常穿着"
    },
    {
        id: 3,
        name: "Samsung 65寸电视",
        price: 4999,
        originalPrice: 5999,
        image: "https://via.placeholder.com/300x200/6c757d/ffffff?text=Samsung+TV",
        category: "electronics",
        rating: 4.7,
        reviews: 423,
        brand: "samsung",
        description: "4K Ultra HD智能电视，HDR技术"
    },
    {
        id: 4,
        name: "时尚女装套装",
        price: 399,
        originalPrice: 599,
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Fashion+Set",
        category: "fashion",
        rating: 4.5,
        reviews: 678,
        brand: "zara",
        description: "优质面料，舒适时尚的女装套装"
    },
    {
        id: 5,
        name: "智能咖啡机",
        price: 1299,
        originalPrice: 1599,
        image: "https://via.placeholder.com/300x200/ffc107/000000?text=Coffee+Machine",
        category: "home",
        rating: 4.4,
        reviews: 234,
        brand: "delonghi",
        description: "全自动咖啡机，享受咖啡馆品质"
    },
    {
        id: 6,
        name: "Adidas运动外套",
        price: 699,
        originalPrice: 899,
        image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Adidas+Jacket",
        category: "sports",
        rating: 4.6,
        reviews: 445,
        brand: "adidas",
        description: "防风防水运动外套，户外必备"
    },
    {
        id: 7,
        name: "Apple MacBook Air",
        price: 8999,
        originalPrice: 9999,
        image: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=MacBook+Air",
        category: "electronics",
        rating: 4.9,
        reviews: 1876,
        brand: "apple",
        description: "M2芯片，轻薄便携的笔记本电脑"
    },
    {
        id: 8,
        name: "北欧风台灯",
        price: 299,
        originalPrice: 399,
        image: "https://via.placeholder.com/300x200/20c997/ffffff?text=Nordic+Lamp",
        category: "home",
        rating: 4.3,
        reviews: 156,
        brand: "ikea",
        description: "简约北欧风格，温馨护眼台灯"
    }
];

// 购物车数据管理
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();
    initializeEventListeners();
});

// 加载推荐商品
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    container.innerHTML = '';
    
    // 随机选择6个商品展示
    const shuffled = [...featuredProducts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);
    
    selected.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// 创建商品卡片
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6 mb-4';
    
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
    
    col.innerHTML = `
        <div class="card product-card h-100 fade-in">
            <div class="position-relative">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge bg-danger">-${discountPercent}%</span>
                </div>
                <div class="position-absolute top-0 start-0 m-2">
                    <button class="btn btn-sm btn-outline-light" onclick="toggleWishlist(${product.id})" title="添加到心愿单">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="card-body d-flex flex-column">
                <h6 class="card-title">${product.name}</h6>
                <p class="card-text text-muted small">${product.description}</p>
                <div class="mb-2">
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <small class="text-muted ms-1">(${product.reviews})</small>
                    </div>
                </div>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <span class="product-price">¥${product.price.toLocaleString()}</span>
                            <small class="product-original-price ms-1">¥${product.originalPrice.toLocaleString()}</small>
                        </div>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>加入购物车
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="viewProduct(${product.id})">
                            查看详情
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// 生成星级评分
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

// 搜索商品功能
function searchProducts(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (searchTerm) {
        // 跳转到商品页面并传递搜索参数
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// 添加到购物车
function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // 显示成功消息
    showToast('商品已添加到购物车', 'success');
    
    // 添加动画效果
    animateCartIcon();
}

// 更新购物车数量
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // 添加动画效果
        if (totalItems > 0) {
            cartCountElement.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                cartCountElement.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }
}

// 购物车图标动画
function animateCartIcon() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.classList.add('animate__animated', 'animate__tada');
        setTimeout(() => {
            cartIcon.classList.remove('animate__animated', 'animate__tada');
        }, 1000);
    }
}

// 查看商品详情
function viewProduct(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;
    
    // 这里可以跳转到商品详情页或显示模态框
    showProductModal(product);
}

// 显示商品详情模态框
function showProductModal(product) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('productModalTitle');
    const modalBody = document.getElementById('productModalBody');
    
    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h5>${product.name}</h5>
                <p class="text-muted">${product.description}</p>
                <div class="mb-3">
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <small class="text-muted ms-1">(${product.reviews} 评价)</small>
                    </div>
                </div>
                <div class="mb-3">
                    <span class="h4 text-danger">¥${product.price.toLocaleString()}</span>
                    <span class="text-muted text-decoration-line-through ms-2">¥${product.originalPrice.toLocaleString()}</span>
                </div>
                <div class="mb-3">
                    <span class="badge bg-primary">${product.brand}</span>
                    <span class="badge bg-secondary ms-1">${getCategoryName(product.category)}</span>
                </div>
                <div class="mb-3">
                    <h6>商品特点：</h6>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-check text-success me-2"></i>品质保证</li>
                        <li><i class="fas fa-check text-success me-2"></i>快速发货</li>
                        <li><i class="fas fa-check text-success me-2"></i>售后无忧</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // 设置模态框中的添加购物车按钮
    window.currentModalProductId = product.id;
    
    modal.show();
}

// 从模态框添加到购物车
function addToCartFromModal() {
    if (window.currentModalProductId) {
        addToCart(window.currentModalProductId);
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    }
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'electronics': '电子产品',
        'fashion': '时尚服饰',
        'home': '家居生活',
        'sports': '运动户外'
    };
    return categories[category] || category;
}

// 心愿单功能
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('已从心愿单移除', 'info');
    } else {
        wishlist.push(productId);
        showToast('已添加到心愿单', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcons();
}

// 更新心愿单图标状态
function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('[onclick^="toggleWishlist"]').forEach(button => {
        const productId = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        const icon = button.querySelector('i');
        
        if (wishlist.includes(productId)) {
            icon.className = 'fas fa-heart text-danger';
        } else {
            icon.className = 'far fa-heart';
        }
    });
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建Toast容器（如果不存在）
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // 创建Toast元素
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0`;
    toast.setAttribute('role', 'alert');
    
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
    
    // 显示Toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();
    
    // 移除过期的Toast
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// 初始化事件监听器
function initializeEventListeners() {
    // 搜索表单提交
    const searchForm = document.querySelector('form[onsubmit="searchProducts(event)"]');
    if (searchForm) {
        searchForm.addEventListener('submit', searchProducts);
    }
    
    // 回到顶部按钮
    createBackToTopButton();
    
    // 页面滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 页面可见性变化（用于刷新购物车数量）
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            updateCartCount();
        }
    });
}

// 创建回到顶部按钮
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'btn btn-primary position-fixed bottom-0 end-0 m-3 rounded-circle';
    backToTopBtn.style.display = 'none';
    backToTopBtn.style.zIndex = '9998';
    backToTopBtn.style.width = '50px';
    backToTopBtn.style.height = '50px';
    backToTopBtn.title = '回到顶部';
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopBtn);
    window.backToTopBtn = backToTopBtn;
}

// 处理页面滚动
function handleScroll() {
    const backToTopBtn = window.backToTopBtn;
    if (backToTopBtn) {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
            backToTopBtn.classList.add('fade-in');
        } else {
            backToTopBtn.style.display = 'none';
            backToTopBtn.classList.remove('fade-in');
        }
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出全局函数
window.searchProducts = searchProducts;
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.addToCartFromModal = addToCartFromModal;
window.toggleWishlist = toggleWishlist;
window.featuredProducts = featuredProducts;