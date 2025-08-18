// PinguBuy 商品数据和功能

// 示例商品数据
const sampleProducts = [
    {
        id: 1,
        title: "Short-Sleeved T-Shirt Men's Summer Casual Loose Half-Sleeve Top",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        priceUSD: 8.28,
        priceCNY: 58.80,
        badges: ["taobao"]
    },
    {
        id: 2,
        title: "Short-Sleeved T-Shirt Summer Fresh Small Daisy Print Casual Top",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
        priceUSD: 6.56,
        priceCNY: 46.60,
        originalPrice: 52.00,
        badges: ["taobao", "deal"]
    },
    {
        id: 3,
        title: "4 Pieces Summer Pure Cotton Short Sleeve T-Shirt Set",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
        priceUSD: 11.10,
        priceCNY: 78.80,
        badges: ["taobao", "bulk"]
    },
    {
        id: 4,
        title: "2 Pieces of Woodpecker Short Sleeve Polo Shirt Men's Set",
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
        priceUSD: 11.13,
        priceCNY: 79.00,
        badges: ["taobao", "bulk"]
    },
    {
        id: 5,
        title: "3 Pieces of Summer Work Clothes Short Sleeve T-Shirt Set",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
        priceUSD: 2.23,
        priceCNY: 15.80,
        badges: ["taobao", "speed"]
    },
    {
        id: 6,
        title: "Men's Casual Short Sleeve Polo Shirt Summer Cotton Top",
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
        priceUSD: 9.45,
        priceCNY: 67.20,
        badges: ["taobao"]
    },
    {
        id: 7,
        title: "Vintage Style Casual T-Shirt with Print Design",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
        priceUSD: 7.88,
        priceCNY: 56.00,
        badges: ["taobao", "deal"]
    },
    {
        id: 8,
        title: "Summer Breathable Cotton Blend Casual Wear Set",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        priceUSD: 13.25,
        priceCNY: 94.20,
        badges: ["taobao"]
    },
    {
        id: 9,
        title: "Premium Quality Business Casual Polo Shirt",
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
        priceUSD: 15.60,
        priceCNY: 111.00,
        badges: ["taobao"]
    },
    {
        id: 10,
        title: "Comfortable Daily Wear T-Shirt Collection",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
        priceUSD: 4.99,
        priceCNY: 35.50,
        badges: ["taobao", "speed"]
    }
];

// 生成徽章HTML
function generateBadges(badges) {
    const badgeMap = {
        'taobao': '<span class="badge-taobao">淘</span>',
        'deal': '<span class="badge-deal">买一送一</span>',
        'bulk': '<span class="badge-bulk">4件装</span>',
        'speed': '<span class="badge-speed">顺风速度</span>'
    };
    
    return badges.map(badge => badgeMap[badge] || '').join('');
}

// 生成商品卡片HTML
function generateProductCard(product) {
    const originalPriceHTML = product.originalPrice 
        ? `<span class="price-original">¥${product.originalPrice.toFixed(2)}</span>` 
        : '';
    
    return `
        <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="promotion-badge">
                        ${generateBadges(product.badges)}
                    </div>
                </div>
                <div class="product-info">
                    <h6 class="product-title">${product.title}</h6>
                    <div class="product-price">
                        <span class="price-usd">$${product.priceUSD.toFixed(2)}</span>
                        <span class="price-cny">¥${product.priceCNY.toFixed(2)}</span>
                        ${originalPriceHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染商品列表
function renderProducts(products = sampleProducts) {
    const productGrid = document.getElementById('productGrid');
    
    if (!productGrid) {
        console.error('Product grid container not found');
        return;
    }
    
    // 显示加载状态
    productGrid.innerHTML = `
        <div class="col-12">
            <div class="loading">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
            </div>
        </div>
    `;
    
    // 模拟网络延迟
    setTimeout(() => {
        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h4>没有找到相关商品</h4>
                        <p>请尝试使用其他关键词搜索</p>
                    </div>
                </div>
            `;
            return;
        }
        
        productGrid.innerHTML = products.map(product => generateProductCard(product)).join('');
        
        // 添加商品卡片点击事件
        addProductClickEvents();
        
        // 初始化工具提示
        initializeTooltips();
    }, 500);
}

// 添加商品点击事件
function addProductClickEvents() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = sampleProducts.find(p => p.id == productId);
            if (product) {
                showProductModal(product);
            }
        });
    });
}

// 显示商品详情模态框
function showProductModal(product) {
    // 这里可以实现商品详情模态框
    alert(`商品详情：${product.title}\n价格：$${product.priceUSD} / ¥${product.priceCNY}`);
}

// 初始化工具提示
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// 搜索功能
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        renderProducts(sampleProducts);
        return;
    }
    
    const filteredProducts = sampleProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
    
    // 更新搜索结果信息
    updateSearchInfo(searchTerm, filteredProducts.length);
}

// 更新搜索信息
function updateSearchInfo(searchTerm, resultCount) {
    const searchInfo = document.querySelector('.search-info');
    if (searchInfo) {
        searchInfo.innerHTML = `
            <div class="container">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted">正在搜索 "</span>
                        <span class="fw-bold text-primary">${searchTerm}</span>
                        <span class="text-muted">"，找到 ${resultCount} 个商品</span>
                    </div>
                    <div class="text-end">
                        <span class="text-muted">已同意</span>
                        <a href="#" class="text-primary text-decoration-none">《搜索服务条款》</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// 初始化页面
function initializePage() {
    // 渲染商品列表
    renderProducts();
    
    // 绑定搜索表单事件
    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // 绑定搜索输入框事件（实时搜索）
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.trim() === '') {
                    renderProducts(sampleProducts);
                    // 重置搜索信息
                    const searchInfo = document.querySelector('.search-info');
                    if (searchInfo) {
                        searchInfo.innerHTML = `
                            <div class="container">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span class="text-muted">正在搜索 "</span>
                                        <span class="fw-bold text-primary">衣服</span>
                                        <span class="text-muted">"，为你找到以下商品</span>
                                    </div>
                                    <div class="text-end">
                                        <span class="text-muted">已同意</span>
                                        <a href="#" class="text-primary text-decoration-none">《搜索服务条款》</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            }, 300);
        });
    }
    
    // 响应式导航栏
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            navbarCollapse.classList.toggle('show');
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage);

// 导出函数供外部使用
window.PinguBuy = {
    renderProducts,
    handleSearch,
    sampleProducts
};