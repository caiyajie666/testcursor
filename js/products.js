// 商品列表页面功能

// 导入商品数据（从main.js）
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentSort = 'default';
let currentView = 'grid';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeFilters();
    parseURLParameters();
    updateCartCount();
});

// 加载商品数据
function loadProducts() {
    // 扩展商品数据（复用main.js中的数据并添加更多商品）
    allProducts = [
        ...window.featuredProducts || [],
        // 添加更多商品数据
        {
            id: 9,
            name: "小米13 Pro",
            price: 4999,
            originalPrice: 5999,
            image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Xiaomi+13+Pro",
            category: "electronics",
            rating: 4.7,
            reviews: 892,
            brand: "xiaomi",
            description: "骁龙8 Gen2处理器，徕卡光学镜头"
        },
        {
            id: 10,
            name: "Zara连衣裙",
            price: 599,
            originalPrice: 799,
            image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Zara+Dress",
            category: "fashion",
            rating: 4.4,
            reviews: 567,
            brand: "zara",
            description: "优雅修身连衣裙，多色可选"
        },
        {
            id: 11,
            name: "戴森吸尘器",
            price: 2999,
            originalPrice: 3499,
            image: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=Dyson+Vacuum",
            category: "home",
            rating: 4.8,
            reviews: 1203,
            brand: "dyson",
            description: "无线手持吸尘器，强劲吸力"
        },
        {
            id: 12,
            name: "Under Armour运动T恤",
            price: 299,
            originalPrice: 399,
            image: "https://via.placeholder.com/300x200/96ceb4/ffffff?text=UA+Tshirt",
            category: "sports",
            rating: 4.5,
            reviews: 334,
            brand: "underarmour",
            description: "透气速干，运动首选"
        },
        {
            id: 13,
            name: "iPad Pro 11寸",
            price: 6799,
            originalPrice: 7299,
            image: "https://via.placeholder.com/300x200/feca57/000000?text=iPad+Pro",
            category: "electronics",
            rating: 4.9,
            reviews: 1456,
            brand: "apple",
            description: "M2芯片，支持Apple Pencil"
        },
        {
            id: 14,
            name: "优衣库羽绒服",
            price: 999,
            originalPrice: 1299,
            image: "https://via.placeholder.com/300x200/ff9ff3/000000?text=Uniqlo+Down",
            category: "fashion",
            rating: 4.6,
            reviews: 789,
            brand: "uniqlo",
            description: "轻薄保暖，防水透气"
        },
        {
            id: 15,
            name: "宜家书桌",
            price: 899,
            originalPrice: 1199,
            image: "https://via.placeholder.com/300x200/54a0ff/ffffff?text=IKEA+Desk",
            category: "home",
            rating: 4.3,
            reviews: 445,
            brand: "ikea",
            description: "简约现代设计，可调节高度"
        },
        {
            id: 16,
            name: "New Balance运动鞋",
            price: 799,
            originalPrice: 999,
            image: "https://via.placeholder.com/300x200/5f27cd/ffffff?text=NB+Shoes",
            category: "sports",
            rating: 4.7,
            reviews: 623,
            brand: "newbalance",
            description: "复古跑鞋，舒适透气"
        }
    ];
    
    filteredProducts = [...allProducts];
    renderProducts();
    updateProductCount();
    renderPagination();
}

// 解析URL参数
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
        // 设置分类筛选
        const categoryRadio = document.getElementById(`category${category.charAt(0).toUpperCase() + category.slice(1)}`);
        if (categoryRadio) {
            categoryRadio.checked = true;
            applyFilters();
        }
        
        // 更新面包屑
        updateBreadcrumb(getCategoryName(category));
    }
    
    if (search) {
        // 设置搜索输入框
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = search;
        }
        
        // 执行搜索
        searchProducts();
        updateBreadcrumb(`搜索: ${search}`);
    }
}

// 更新面包屑导航
function updateBreadcrumb(text) {
    const breadcrumb = document.getElementById('breadcrumbCategory');
    if (breadcrumb) {
        breadcrumb.textContent = text;
    }
}

// 初始化筛选器
function initializeFilters() {
    // 分类筛选事件
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // 价格区间筛选事件
    document.querySelectorAll('input[name="priceRange"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // 品牌筛选事件
    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // 价格输入框事件
    document.getElementById('minPrice').addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('maxPrice').addEventListener('input', debounce(applyFilters, 500));
}

// 应用筛选
function applyFilters() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const selectedPriceRange = document.querySelector('input[name="priceRange"]:checked').value;
    const selectedBrands = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    filteredProducts = allProducts.filter(product => {
        // 分类筛选
        if (selectedCategory && product.category !== selectedCategory) {
            return false;
        }
        
        // 价格区间筛选
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
            if (product.price < min || product.price > max) {
                return false;
            }
        }
        
        // 自定义价格筛选
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // 品牌筛选
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    sortProducts();
}

// 清除筛选
function clearFilters() {
    // 重置分类
    document.getElementById('categoryAll').checked = true;
    
    // 重置价格区间
    document.getElementById('priceAll').checked = true;
    
    // 重置品牌
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // 重置价格输入框
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    // 重新应用筛选
    applyFilters();
}

// 搜索商品
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm) {
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredProducts = [...allProducts];
    }
    
    currentPage = 1;
    sortProducts();
}

// 商品排序
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // 默认排序：按ID
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    renderProducts();
    updateProductCount();
    renderPagination();
}

// 切换视图
function toggleView(view) {
    currentView = view;
    
    // 更新按钮状态
    document.getElementById('gridView').classList.toggle('active', view === 'grid');
    document.getElementById('listView').classList.toggle('active', view === 'list');
    
    // 更新容器类名
    const container = document.getElementById('productGrid');
    container.className = view === 'list' ? 'list-view' : 'row';
    
    renderProducts();
}

// 渲染商品
function renderProducts() {
    const container = document.getElementById('productGrid');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">没有找到匹配的商品</h4>
                <p class="text-muted">请尝试调整筛选条件或搜索关键词</p>
                <button class="btn btn-primary" onclick="clearFilters()">清除筛选</button>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}

// 创建商品元素
function createProductElement(product) {
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
    const col = document.createElement('div');
    
    if (currentView === 'list') {
        col.className = 'col-12';
        col.innerHTML = `
            <div class="card product-card mb-3">
                <div class="row g-0">
                    <div class="col-md-3">
                        <div class="position-relative">
                            <img src="${product.image}" class="product-image w-100" alt="${product.name}">
                            <div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-danger">-${discountPercent}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="card-body h-100 d-flex flex-column">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text text-muted">${product.description}</p>
                                    <div class="mb-2">
                                        <div class="product-rating">
                                            ${generateStars(product.rating)}
                                            <small class="text-muted ms-1">(${product.reviews} 评价)</small>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <span class="badge bg-primary">${product.brand}</span>
                                        <span class="badge bg-secondary ms-1">${getCategoryName(product.category)}</span>
                                    </div>
                                </div>
                                <div class="col-md-4 text-end">
                                    <div class="mb-2">
                                        <div class="product-price">¥${product.price.toLocaleString()}</div>
                                        <small class="product-original-price">¥${product.originalPrice.toLocaleString()}</small>
                                    </div>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                            <i class="fas fa-cart-plus me-1"></i>加入购物车
                                        </button>
                                        <button class="btn btn-outline-secondary" onclick="viewProduct(${product.id})">
                                            查看详情
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
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
    }
    
    return col;
}

// 更新商品数量显示
function updateProductCount() {
    const totalElement = document.getElementById('totalProducts');
    if (totalElement) {
        totalElement.textContent = filteredProducts.length;
    }
}

// 渲染分页
function renderPagination() {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let pagination = '';
    
    // 上一页
    if (currentPage > 1) {
        pagination += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
    }
    
    // 页码
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        pagination += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1)">1</a>
            </li>
        `;
        if (startPage > 2) {
            pagination += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pagination += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagination += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        pagination += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
            </li>
        `;
    }
    
    // 下一页
    if (currentPage < totalPages) {
        pagination += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
    }
    
    container.innerHTML = pagination;
}

// 切换页面
function changePage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 复用函数（从main.js）
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

function getCategoryName(category) {
    const categories = {
        'electronics': '电子产品',
        'fashion': '时尚服饰',
        'home': '家居生活',
        'sports': '运动户外'
    };
    return categories[category] || category;
}

// 购物车相关功能
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    showToast('商品已添加到购物车', 'success');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    showProductModal(product);
}

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
    
    window.currentModalProductId = product.id;
    modal.show();
}

function addToCartFromModal() {
    if (window.currentModalProductId) {
        addToCart(window.currentModalProductId);
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    }
}

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

// 防抖函数
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

// 导出全局函数
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.sortProducts = sortProducts;
window.toggleView = toggleView;
window.changePage = changePage;
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.addToCartFromModal = addToCartFromModal;
window.toggleWishlist = toggleWishlist;
window.searchProducts = searchProducts;