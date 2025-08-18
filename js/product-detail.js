// 商品详情页交互功能

// 全局变量
let selectedSize = '';
let selectedColor = 'black';
let currentQuantity = 1;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
    bindEventListeners();
    updateCartCount();
});

// 初始化商品详情页
function initializeProductDetail() {
    // 设置默认选中状态
    const firstSizeBtn = document.querySelector('.size-btn');
    if (firstSizeBtn) {
        selectSize(firstSizeBtn, firstSizeBtn.dataset.size);
    }
    
    // 检查协议状态
    checkAgreementStatus();
    
    // 加载购物车数量
    updateCartCount();
}

// 绑定事件监听器
function bindEventListeners() {
    // 协议复选框
    const agreementCheck = document.getElementById('agreementCheck');
    if (agreementCheck) {
        agreementCheck.addEventListener('change', checkAgreementStatus);
    }
    
    // 尺码选择按钮
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectSize(btn, btn.dataset.size));
    });
    
    // 颜色选择按钮
    const colorButtons = document.querySelectorAll('.color-options .btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => selectColor(btn, btn.dataset.color));
    });
    
    // 购买按钮
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', buyNow);
    }
    
    // 喜欢按钮
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', toggleLike);
    }
    
    // 数量输入框
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value > 0) {
                currentQuantity = value;
            } else {
                this.value = 1;
                currentQuantity = 1;
            }
        });
    }
}

// 更改主图片
function changeMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.style.opacity = '0.5';
        setTimeout(() => {
            mainImage.src = src;
            mainImage.style.opacity = '1';
        }, 200);
    }
    
    // 更新缩略图激活状态
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src.includes(src.split('?')[0].split('/').pop().split('.')[0])) {
            thumb.classList.add('active');
        }
    });
}

// 选择尺码
function selectSize(button, size) {
    // 移除其他按钮的激活状态
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
    });
    
    // 激活当前按钮
    button.classList.remove('btn-outline-secondary');
    button.classList.add('btn-primary', 'active');
    
    selectedSize = size;
    checkFormValidity();
    
    // 添加选择动画
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// 选择颜色
function selectColor(button, color) {
    // 移除其他按钮的激活状态
    document.querySelectorAll('.color-options .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 激活当前按钮
    button.classList.add('active');
    selectedColor = color;
    
    // 添加选择动画
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// 增加数量
function increaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        currentQuantity = parseInt(quantityInput.value) + 1;
        quantityInput.value = currentQuantity;
    }
}

// 减少数量
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput && currentQuantity > 1) {
        currentQuantity = parseInt(quantityInput.value) - 1;
        quantityInput.value = currentQuantity;
    }
}

// 检查协议状态
function checkAgreementStatus() {
    const agreementCheck = document.getElementById('agreementCheck');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (agreementCheck && addToCartBtn && buyNowBtn) {
        const isChecked = agreementCheck.checked;
        const isFormValid = selectedSize && isChecked;
        
        addToCartBtn.disabled = !isFormValid;
        buyNowBtn.disabled = !isFormValid;
        
        if (isFormValid) {
            addToCartBtn.classList.remove('btn-secondary');
            addToCartBtn.classList.add('btn-primary');
            buyNowBtn.classList.remove('btn-outline-secondary');
            buyNowBtn.classList.add('btn-outline-primary');
        } else {
            addToCartBtn.classList.remove('btn-primary');
            addToCartBtn.classList.add('btn-secondary');
            buyNowBtn.classList.remove('btn-outline-primary');
            buyNowBtn.classList.add('btn-outline-secondary');
        }
    }
}

// 检查表单有效性
function checkFormValidity() {
    checkAgreementStatus();
}

// 添加到购物车
function addToCart() {
    if (!selectedSize) {
        showToast('请选择尺码', 'warning');
        return;
    }
    
    const agreementCheck = document.getElementById('agreementCheck');
    if (!agreementCheck.checked) {
        showToast('请先同意服务条款', 'warning');
        return;
    }
    
    // 创建商品数据
    const product = {
        id: 'W17004',
        name: '[Cyber Butterfly Shadow] Boylondon Spring/Summer Women Dress Mechanical Wings Black Knitting Skirt W17004',
        price: 98.45,
        currency: 'USD',
        size: selectedSize,
        color: selectedColor,
        quantity: currentQuantity,
        image: document.getElementById('mainImage').src,
        brand: 'BOYLONDON'
    };
    
    // 添加到购物车动画
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.innerHTML = '<span class="loading-spinner"></span> 添加中...';
    addToCartBtn.disabled = true;
    
    // 模拟添加到购物车的异步操作
    setTimeout(() => {
        // 获取现有购物车数据
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // 检查是否已存在相同商品
        const existingIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        // 保存到本地存储
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 恢复按钮状态
        addToCartBtn.innerHTML = 'Add To Cart';
        addToCartBtn.disabled = false;
        
        // 更新购物车数量
        updateCartCount();
        
        // 显示成功提示
        showToast('商品已添加到购物车！', 'success');
        
        // 购物车图标动画
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            cartIcon.parentElement.classList.add('cart-bounce');
            setTimeout(() => {
                cartIcon.parentElement.classList.remove('cart-bounce');
            }, 600);
        }
        
    }, 1000);
}

// 立即购买
function buyNow() {
    if (!selectedSize) {
        showToast('请选择尺码', 'warning');
        return;
    }
    
    const agreementCheck = document.getElementById('agreementCheck');
    if (!agreementCheck.checked) {
        showToast('请先同意服务条款', 'warning');
        return;
    }
    
    // 添加到购物车
    addToCart();
    
    // 延迟跳转到购物车页面
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1500);
}

// 切换喜欢状态
function toggleLike() {
    const likeBtn = document.getElementById('likeBtn');
    const icon = likeBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        likeBtn.classList.remove('btn-outline-secondary');
        likeBtn.classList.add('btn-danger');
        showToast('已添加到收藏', 'success');
        
        // 心形动画
        icon.classList.add('heart-animation');
        setTimeout(() => {
            icon.classList.remove('heart-animation');
        }, 600);
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        likeBtn.classList.remove('btn-danger');
        likeBtn.classList.add('btn-outline-secondary');
        showToast('已取消收藏', 'info');
    }
}

// 更新购物车数量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 移除现有的提示
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `success-toast ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 设置样式
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    };
    
    toast.style.background = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// 获取提示图标
function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 页面滚动时的效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// 图片放大镜效果
function initImageZoom() {
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;
    
    mainImage.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        this.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });
    
    mainImage.addEventListener('mouseleave', function() {
        this.style.transformOrigin = 'center center';
    });
}

// 初始化图片放大镜
document.addEventListener('DOMContentLoaded', function() {
    initImageZoom();
    lazyLoadImages();
});

// 复制链接功能
function copyProductLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('链接已复制到剪贴板', 'success');
    }).catch(() => {
        showToast('复制失败，请手动复制', 'warning');
    });
}

// 分享功能
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: '看看这个商品，很不错哦！',
            url: window.location.href
        }).catch(console.error);
    } else {
        copyProductLink();
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 快速添加到购物车
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn && !addToCartBtn.disabled) {
            addToCart();
        }
    }
    
    // 数字键选择尺码
    const sizeButtons = document.querySelectorAll('.size-btn');
    const keyNum = parseInt(e.key);
    if (keyNum >= 1 && keyNum <= sizeButtons.length) {
        const targetBtn = sizeButtons[keyNum - 1];
        selectSize(targetBtn, targetBtn.dataset.size);
    }
});

// 价格动画效果
function animatePrice() {
    const priceElement = document.querySelector('.current-price');
    if (!priceElement) return;
    
    const finalPrice = parseFloat(priceElement.textContent.replace('$', ''));
    let currentPrice = 0;
    const increment = finalPrice / 50;
    
    const timer = setInterval(() => {
        currentPrice += increment;
        if (currentPrice >= finalPrice) {
            currentPrice = finalPrice;
            clearInterval(timer);
        }
        priceElement.textContent = `$${currentPrice.toFixed(2)}`;
    }, 20);
}

// 页面加载完成后执行价格动画
window.addEventListener('load', function() {
    setTimeout(animatePrice, 500);
});