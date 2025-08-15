// 用户认证相关功能

// 模拟用户数据存储
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
    checkAuthStatus();
});

// 初始化认证页面
function initializeAuthPage() {
    // 如果已登录，重定向到首页
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        // showToast('您已登录', 'info');
        // window.location.href = 'index.html';
    }
    
    updateAuthUI();
}

// 检查登录状态
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        currentUser = user;
        updateAuthUI();
    }
}

// 处理登录表单提交
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // 表单验证
    if (!validateEmail(email)) {
        showError('请输入有效的邮箱地址');
        return;
    }
    
    if (!password) {
        showError('请输入密码');
        return;
    }
    
    // 显示加载状态
    showLoading(true);
    
    // 模拟异步登录
    setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            if (remember) {
                localStorage.setItem('rememberUser', 'true');
            }
            
            showSuccess('登录成功！正在跳转...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('邮箱或密码错误，请重试');
        }
        
        showLoading(false);
    }, 1000);
}

// 处理注册表单提交
function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.getElementById('gender').value;
    const newsletter = document.getElementById('newsletter').checked;
    const terms = document.getElementById('terms').checked;
    
    // 表单验证
    const validation = validateRegistrationForm({
        firstName, lastName, email, phone, password, confirmPassword, terms
    });
    
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    // 检查邮箱是否已存在
    if (users.some(u => u.email === email)) {
        showError('该邮箱已被注册，请使用其他邮箱');
        return;
    }
    
    // 显示加载状态
    showLoading(true);
    
    // 模拟异步注册
    setTimeout(() => {
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            phone,
            password, // 实际应用中应该加密存储
            birthDate,
            gender,
            newsletter,
            registeredAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showSuccess('注册成功！请登录您的账户');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
        showLoading(false);
    }, 1500);
}

// 注册表单验证
function validateRegistrationForm(data) {
    const { firstName, lastName, email, phone, password, confirmPassword, terms } = data;
    
    if (!firstName || firstName.length < 2) {
        return { isValid: false, message: '请输入有效的姓氏（至少2个字符）' };
    }
    
    if (!lastName || lastName.length < 2) {
        return { isValid: false, message: '请输入有效的名字（至少2个字符）' };
    }
    
    if (!validateEmail(email)) {
        return { isValid: false, message: '请输入有效的邮箱地址' };
    }
    
    if (!validatePhone(phone)) {
        return { isValid: false, message: '请输入有效的手机号码' };
    }
    
    if (!validatePassword(password)) {
        return { 
            isValid: false, 
            message: '密码必须至少8位，包含字母和数字' 
        };
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, message: '两次输入的密码不一致' };
    }
    
    if (!terms) {
        return { isValid: false, message: '请同意服务条款和隐私政策' };
    }
    
    return { isValid: true };
}

// 邮箱验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 手机号验证
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 密码验证
function validatePassword(password) {
    if (password.length < 8) return false;
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasLetter && hasNumber;
}

// 切换密码可见性
function togglePassword(inputId = 'password') {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = inputId === 'password' ? 
        document.getElementById('toggleIcon') : 
        document.getElementById('toggleIcon' + (inputId === 'confirmPassword' ? '2' : '1'));
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (toggleIcon) toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        if (toggleIcon) toggleIcon.className = 'fas fa-eye';
    }
}

// 显示加载状态
function showLoading(isLoading) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading me-2"></span>处理中...';
    } else {
        submitBtn.disabled = false;
        const isLogin = window.location.pathname.includes('login.html');
        submitBtn.innerHTML = isLogin ? 
            '<i class="fas fa-sign-in-alt me-2"></i>登录' : 
            '<i class="fas fa-user-plus me-2"></i>注册账户';
    }
}

// 显示成功消息
function showSuccess(message) {
    showMessage(message, 'success');
}

// 显示错误消息
function showError(message) {
    showMessage(message, 'danger');
}

// 显示消息
function showMessage(message, type) {
    // 移除现有消息
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 创建新消息
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // 插入到表单前面
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(alert, form);
    }
    
    // 自动消失
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// 更新认证UI
function updateAuthUI() {
    const authLinks = document.querySelectorAll('.nav-link[href="login.html"], .nav-link[href="register.html"]');
    
    if (currentUser) {
        // 用户已登录，更新导航栏
        authLinks.forEach(link => {
            if (link.href.includes('login.html')) {
                link.textContent = '个人中心';
                link.href = '#';
                link.onclick = showUserMenu;
            } else if (link.href.includes('register.html')) {
                link.textContent = '退出登录';
                link.href = '#';
                link.onclick = logout;
            }
        });
    }
}

// 显示用户菜单
function showUserMenu(event) {
    event.preventDefault();
    
    // 创建用户菜单下拉
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu show position-absolute';
    dropdown.style.right = '0';
    dropdown.style.top = '100%';
    dropdown.innerHTML = `
        <h6 class="dropdown-header">
            <i class="fas fa-user me-2"></i>
            ${currentUser.firstName} ${currentUser.lastName}
        </h6>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#" onclick="viewProfile()">
            <i class="fas fa-user-edit me-2"></i>个人资料
        </a>
        <a class="dropdown-item" href="#" onclick="viewOrders()">
            <i class="fas fa-shopping-bag me-2"></i>我的订单
        </a>
        <a class="dropdown-item" href="#" onclick="viewWishlist()">
            <i class="fas fa-heart me-2"></i>心愿单
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item text-danger" href="#" onclick="logout()">
            <i class="fas fa-sign-out-alt me-2"></i>退出登录
        </a>
    `;
    
    // 显示菜单（这里简化处理）
    alert('用户菜单功能\n用户：' + currentUser.firstName + ' ' + currentUser.lastName);
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberUser');
        currentUser = null;
        
        showToast('已成功退出登录', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// 查看个人资料
function viewProfile() {
    alert('个人资料功能待开发');
}

// 查看订单
function viewOrders() {
    alert('订单查看功能待开发');
}

// 查看心愿单
function viewWishlist() {
    alert('心愿单功能待开发');
}

// 显示提示消息（复用主页的函数）
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

// 社交登录（模拟）
function socialLogin(provider) {
    showToast(`${provider} 登录功能暂未开放`, 'info');
}

// 忘记密码
function forgotPassword() {
    const email = prompt('请输入您的邮箱地址：');
    if (email && validateEmail(email)) {
        showToast('密码重置邮件已发送到您的邮箱', 'success');
    } else if (email) {
        showToast('请输入有效的邮箱地址', 'error');
    }
}

// 导出全局函数
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.togglePassword = togglePassword;
window.logout = logout;
window.viewProfile = viewProfile;
window.viewOrders = viewOrders;
window.viewWishlist = viewWishlist;