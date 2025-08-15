// PinguBuy 代购服务主页JavaScript功能

// 模拟热门代购商品数据
const featuredProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro (中国版)",
        price: 6999,
        originalPrice: 7999,
        image: "https://via.placeholder.com/300x200/667eea/ffffff?text=iPhone+15+Pro",
        category: "electronics",
        rating: 4.8,
        reviews: 1250,
        platform: "apple",
        description: "苹果最新旗舰手机，中国官方版本",
        serviceFee: 350,
        shippingCost: 299
    },
    {
        id: 2,
        name: "小米13 Ultra",
        price: 4999,
        originalPrice: 5499,
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Xiaomi+13+Ultra",
        category: "electronics",
        rating: 4.6,
        reviews: 856,
        platform: "xiaomi",
        description: "徕卡影像旗舰，专业摄影手机",
        serviceFee: 250,
        shippingCost: 299
    },
    {
        id: 3,
        name: "华为Mate 60 Pro",
        price: 6999,
        originalPrice: 7499,
        image: "https://via.placeholder.com/300x200/6c757d/ffffff?text=Huawei+Mate60",
        category: "electronics",
        rating: 4.7,
        reviews: 423,
        platform: "huawei",
        description: "麒麟9000s芯片，卫星通信技术",
        serviceFee: 350,
        shippingCost: 299
    },
    {
        id: 4,
        name: "Supreme联名卫衣",
        price: 1299,
        originalPrice: 1599,
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Supreme+Hoodie",
        category: "fashion",
        rating: 4.5,
        reviews: 678,
        platform: "supreme",
        description: "限量版联名款，潮流必备",
        serviceFee: 130,
        shippingCost: 199
    },
    {
        id: 5,
        name: "飞利浦空气炸锅",
        price: 899,
        originalPrice: 1199,
        image: "https://via.placeholder.com/300x200/ffc107/000000?text=Air+Fryer",
        category: "home",
        rating: 4.4,
        reviews: 234,
        platform: "philips",
        description: "健康无油烹饪，家庭必备厨电",
        serviceFee: 45,
        shippingCost: 199
    },
    {
        id: 6,
        name: "Nike Air Jordan 1",
        price: 1299,
        originalPrice: 1599,
        image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Air+Jordan+1",
        category: "fashion",
        rating: 4.6,
        reviews: 445,
        platform: "nike",
        description: "经典篮球鞋，潮流icon",
        serviceFee: 130,
        shippingCost: 199
    }
];

// 订单数据管理
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// 价格估算缓存
let estimateCache = new Map();

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateOrderCount();
    initSmoothScrolling();
    initEstimateForm();
    initOrderForm();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 搜索表单提交
    const searchForm = document.querySelector('form[onsubmit="searchProducts(event)"]');
    if (searchForm) {
        searchForm.removeAttribute('onsubmit');
        searchForm.addEventListener('submit', searchProducts);
    }
    
    // 价格估算表单
    const estimateForm = document.getElementById('estimateForm');
    if (estimateForm) {
        estimateForm.addEventListener('submit', handleEstimate);
    }
    
    // 创建必要的按钮和功能
    createBackToTopButton();
    createScrollIndicator();
    
    // 页面滚动事件
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            orders = JSON.parse(localStorage.getItem('orders')) || [];
            updateOrderCount();
        }
    });
    
    // 添加淡入动画
    addScrollAnimations();
}

// 平滑滚动导航
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 初始化价格估算表单
function initEstimateForm() {
    const form = document.getElementById('estimateForm');
    if (!form) return;
    
    // 实时输入验证
    const urlInput = document.getElementById('productUrl');
    const quantityInput = document.getElementById('quantity');
    const countrySelect = document.getElementById('country');
    
    if (urlInput) {
        urlInput.addEventListener('input', debounce(validateProductUrl, 500));
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', updateEstimatePreview);
    }
    
    if (countrySelect) {
        countrySelect.addEventListener('change', updateEstimatePreview);
    }
}

// 初始化订单转发表单
function initOrderForm() {
    // 为订单转发按钮添加事件监听器
    document.querySelectorAll('a[href="#order"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showOrderModal();
        });
    });
}

// 搜索中国商品功能
function searchProducts(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (searchTerm) {
        // 模拟搜索中国商品
        showToast(`正在搜索"${searchTerm}"相关的中国商品...`, 'info');
        
        setTimeout(() => {
            showToast('搜索功能正在开发中，敬请期待！', 'warning');
        }, 1500);
    }
}

// 处理价格估算
function handleEstimate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productUrl = formData.get('productUrl') || document.getElementById('productUrl').value;
    const quantity = parseInt(formData.get('quantity')) || parseInt(document.getElementById('quantity').value);
    const country = formData.get('country') || document.getElementById('country').value;
    
    if (!productUrl || !quantity || !country) {
        showToast('请填写完整的估价信息', 'error');
        return;
    }
    
    // 显示加载状态
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> 计算中...';
    submitBtn.disabled = true;
    
    // 模拟API调用
    setTimeout(() => {
        const estimate = calculateEstimate(productUrl, quantity, country);
        displayEstimateResult(estimate);
        
        // 恢复按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showToast('估价计算完成！', 'success');
    }, 2000);
}

// 计算估价
function calculateEstimate(url, quantity, country) {
    // 缓存键
    const cacheKey = `${url}-${quantity}-${country}`;
    
    if (estimateCache.has(cacheKey)) {
        return estimateCache.get(cacheKey);
    }
    
    // 模拟价格计算逻辑
    const basePrice = Math.floor(Math.random() * 5000) + 100; // 随机商品价格
    const serviceFeeRate = getServiceFeeRate(url);
    const shippingCost = getShippingCost(country, quantity);
    
    const productPrice = basePrice * quantity;
    const serviceFee = Math.ceil(productPrice * serviceFeeRate);
    const totalShipping = shippingCost;
    const totalPrice = productPrice + serviceFee + totalShipping;
    
    const estimate = {
        productPrice,
        serviceFee,
        shippingCost: totalShipping,
        totalPrice,
        currency: '¥',
        platform: detectPlatform(url)
    };
    
    // 缓存结果
    estimateCache.set(cacheKey, estimate);
    
    return estimate;
}

// 获取代购费率
function getServiceFeeRate(url) {
    const domain = extractDomain(url);
    const feeRates = {
        'taobao.com': 0.05,
        'tmall.com': 0.05,
        'jd.com': 0.06,
        'pinduoduo.com': 0.08,
        'xiaohongshu.com': 0.10,
        'default': 0.07
    };
    
    return feeRates[domain] || feeRates['default'];
}

// 获取国际运费
function getShippingCost(country, quantity) {
    const shippingRates = {
        'US': { base: 299, perItem: 50 },
        'CA': { base: 259, perItem: 45 },
        'AU': { base: 279, perItem: 48 },
        'UK': { base: 289, perItem: 52 },
        'DE': { base: 269, perItem: 46 },
        'JP': { base: 189, perItem: 35 },
        'KR': { base: 159, perItem: 30 },
        'SG': { base: 199, perItem: 38 },
        'default': { base: 299, perItem: 50 }
    };
    
    const rate = shippingRates[country] || shippingRates['default'];
    return rate.base + (rate.perItem * Math.max(0, quantity - 1));
}

// 检测电商平台
function detectPlatform(url) {
    const domain = extractDomain(url);
    const platforms = {
        'taobao.com': '淘宝',
        'tmall.com': '天猫',
        'jd.com': '京东',
        'pinduoduo.com': '拼多多',
        'xiaohongshu.com': '小红书'
    };
    
    return platforms[domain] || '其他平台';
}

// 提取域名
function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'unknown';
    }
}

// 显示估价结果
function displayEstimateResult(estimate) {
    const resultDiv = document.getElementById('estimateResult');
    if (!resultDiv) return;
    
    document.getElementById('productPrice').textContent = 
        `${estimate.currency}${estimate.productPrice.toLocaleString()}`;
    document.getElementById('serviceFee').textContent = 
        `${estimate.currency}${estimate.serviceFee.toLocaleString()}`;
    document.getElementById('shippingFee').textContent = 
        `${estimate.currency}${estimate.shippingCost.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = 
        `${estimate.currency}${estimate.totalPrice.toLocaleString()}`;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 添加动画效果
    resultDiv.classList.add('fade-in');
}

// 显示订单转发模态框
function showOrderModal() {
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
}

// 提交订单转发申请
function submitOrderTransfer() {
    const orderNumber = document.getElementById('orderNumber').value.trim();
    const platform = document.getElementById('platform').value;
    const shippingAddress = document.getElementById('shippingAddress').value.trim();
    
    if (!orderNumber || !platform || !shippingAddress) {
        showToast('请填写完整的订单信息', 'error');
        return;
    }
    
    // 创建订单转发记录
    const transferOrder = {
        id: Date.now(),
        orderNumber,
        platform,
        shippingAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'transfer'
    };
    
    orders.push(transferOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    updateOrderCount();
    
    // 隐藏模态框
    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
    
    // 清空表单
    document.getElementById('orderForm').reset();
    
    showToast('订单转发申请已提交，我们将尽快处理！', 'success');
}

// 更新订单数量
function updateOrderCount() {
    const orderCountElement = document.getElementById('orderCount');
    if (orderCountElement) {
        const totalOrders = orders.length;
        orderCountElement.textContent = totalOrders;
        
        if (totalOrders > 0) {
            orderCountElement.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                orderCountElement.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }
}

// 验证商品URL
function validateProductUrl(event) {
    const url = event.target.value;
    const isValid = isValidProductUrl(url);
    
    if (url && !isValid) {
        event.target.classList.add('is-invalid');
        showToast('请输入有效的商品链接（支持淘宝、天猫、京东等）', 'error');
    } else {
        event.target.classList.remove('is-invalid');
    }
}

// 检查URL是否有效
function isValidProductUrl(url) {
    const supportedDomains = [
        'taobao.com', 'tmall.com', 'jd.com', 
        'pinduoduo.com', 'xiaohongshu.com'
    ];
    
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        const domain = urlObj.hostname.replace('www.', '');
        return supportedDomains.some(supported => domain.includes(supported));
    } catch {
        return false;
    }
}

// 更新估价预览
function updateEstimatePreview() {
    // 这里可以添加实时预览功能
    // 暂时保留空实现
}

// 创建滚动进度指示器
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    window.scrollIndicator = indicator;
}

// 创建回到顶部按钮
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'btn btn-primary position-fixed rounded-circle';
    backToTopBtn.style.cssText = `
        display: none;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        width: 50px;
        height: 50px;
        border: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    `;
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
    const scrollIndicator = window.scrollIndicator;
    
    // 回到顶部按钮显示/隐藏
    if (backToTopBtn) {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.alignItems = 'center';
            backToTopBtn.style.justifyContent = 'center';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
    
    // 滚动进度指示器
    if (scrollIndicator) {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;
    }
}

// 添加滚动动画
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.service-card, .category-card, .feature-icon').forEach(el => {
        observer.observe(el);
    });
}

// 显示提示消息
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
    toast.className = `toast align-items-center text-white bg-${
        type === 'success' ? 'success' : 
        type === 'error' ? 'danger' : 
        type === 'warning' ? 'warning' : 
        'info'
    } border-0`;
    toast.setAttribute('role', 'alert');
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${iconMap[type]} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: type === 'error' ? 5000 : 3000
    });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
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
window.handleEstimate = handleEstimate;
window.submitOrderTransfer = submitOrderTransfer;
window.showOrderModal = showOrderModal;
window.featuredProducts = featuredProducts;