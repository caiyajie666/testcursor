// 商品详情与购买页逻辑

let pageProduct = null;
let exchangeRate = 7.1; // USD -> CNY 近似汇率，可在页面切换

document.addEventListener('DOMContentLoaded', () => {
	// 从本地或URL获取商品（演示：如果没有传参，就用一个示例）
	const params = new URLSearchParams(location.search);
	const pid = Number(params.get('id')) || 4;
	pageProduct = findProductById(pid);

	if (!pageProduct) {
		// 兜底：构造一个示例商品（和截图风格类似：连衣裙）
		pageProduct = {
			id: 10001,
			name: 'Boylondon 机械翅膀连衣裙 黑色',
			priceUSD: 98.45,
			image: 'https://via.placeholder.com/700x700/000000/ffffff?text=BOY+LONDON',
			gallery: [
				'https://via.placeholder.com/700x700/000000/ffffff?text=Front',
				'https://via.placeholder.com/700x700/111111/ffffff?text=Back',
				'https://via.placeholder.com/700x700/222222/ffffff?text=Detail'
			],
			description: '春夏连衣裙，机械翅膀印花，宽松舒适版型',
			colors: ['Black'],
			sizes: ['XS','S','M','L']
		};
	}

	initPage();
});

function findProductById(id) {
	try {
		const fromMain = (window.featuredProducts || []).find(p => p.id === id);
		if (fromMain) {
			return {
				id: fromMain.id,
				name: fromMain.name,
				priceUSD: Number((fromMain.price / exchangeRate).toFixed(2)),
				image: fromMain.image,
				gallery: [fromMain.image],
				description: fromMain.description,
				colors: ['默认'],
				sizes: ['均码']
			};
		}
	} catch (e) {}
	return null;
}

function initPage() {
	// 标题与面包屑
	document.getElementById('productName').textContent = pageProduct.name;
	document.getElementById('breadcrumbName').textContent = pageProduct.name;

	// 价格
	updatePriceDisplay();
	document.getElementById('changeRate').addEventListener('click', (e) => {
		e.preventDefault();
		const val = prompt('请输入USD->CNY汇率', String(exchangeRate));
		if (!val) return;
		const num = Number(val);
		if (!isNaN(num) && num > 0) {
			exchangeRate = num;
			updatePriceDisplay();
		}
	});

	// 图片
	const mainImage = document.getElementById('mainImage');
	mainImage.src = pageProduct.image || pageProduct.gallery[0];
	const thumbList = document.getElementById('thumbList');
	(pageProduct.gallery || []).forEach((src, idx) => {
		const img = document.createElement('img');
		img.src = src;
		img.alt = 'thumb-' + idx;
		img.style.width = '64px';
		img.style.height = '64px';
		img.style.objectFit = 'cover';
		img.className = 'rounded border';
		img.addEventListener('click', () => mainImage.src = src);
		thumbList.appendChild(img);
	});

	// 颜色
	const colorOptions = document.getElementById('colorOptions');
	(pageProduct.colors || []).forEach((c, idx) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'btn btn-outline-secondary btn-sm';
		btn.textContent = c;
		btn.dataset.value = c;
		btn.addEventListener('click', () => selectOption(colorOptions, btn));
		if (idx === 0) btn.classList.add('active');
		colorOptions.appendChild(btn);
	});

	// 尺码
	const sizeOptions = document.getElementById('sizeOptions');
	(pageProduct.sizes || []).forEach((s, idx) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'btn btn-outline-secondary btn-sm';
		btn.textContent = s;
		btn.dataset.value = s;
		btn.addEventListener('click', () => selectOption(sizeOptions, btn));
		if (idx === 0) btn.classList.add('active');
		sizeOptions.appendChild(btn);
	});

	// 数量
	const qtyInput = document.getElementById('quantityInput');
	document.getElementById('minusBtn').addEventListener('click', () => {
		qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
	});
	document.getElementById('plusBtn').addEventListener('click', () => {
		qtyInput.value = Math.min(99, Number(qtyInput.value) + 1);
	});

	// 详情
	document.getElementById('detailDesc').textContent = pageProduct.description || '';
	document.getElementById('detailImage').src = pageProduct.image || '';

	// 勾选协议后才允许购买
	const agree = document.getElementById('agreeCheck');
	const addBtn = document.getElementById('addCartBtn');
	const buyBtn = document.getElementById('buyNowBtn');
	agree.addEventListener('change', () => {
		addBtn.disabled = buyBtn.disabled = !agree.checked;
	});

	addBtn.addEventListener('click', addToCartHandler);
	buyBtn.addEventListener('click', buyNowHandler);

	// 初始购物车数量
	updateCartCount();
}

function updatePriceDisplay() {
	const usd = pageProduct.priceUSD ?? 98.45;
	const cny = Math.round(usd * exchangeRate);
	document.getElementById('usdPrice').textContent = `$${usd.toFixed(2)}`;
	document.getElementById('cnyPrice').textContent = `¥${cny}`;
}

function selectOption(container, btn) {
	container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
	btn.classList.add('active');
}

function getSelectedValue(containerId) {
	const active = document.querySelector(`#${containerId} .active`);
	return active ? active.dataset.value : '';
}

function addToCartHandler() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const qty = Number(document.getElementById('quantityInput').value) || 1;
	const color = getSelectedValue('colorOptions');
	const size = getSelectedValue('sizeOptions');

	const itemId = `${pageProduct.id}-${color}-${size}`;
	const existing = cart.find(i => i.itemId === itemId);
	const usd = pageProduct.priceUSD ?? 98.45;
	const cnyPrice = Math.round(usd * exchangeRate);

	const baseItem = {
		id: pageProduct.id,
		itemId,
		name: pageProduct.name,
		image: pageProduct.image,
		description: pageProduct.description,
		brand: 'boylondon',
		price: cnyPrice,
		originalPrice: Math.round(cnyPrice * 1.2),
		quantity: qty,
		color,
		size
	};

	if (existing) {
		existing.quantity += qty;
	} else {
		cart.push(baseItem);
	}

	localStorage.setItem('cart', JSON.stringify(cart));
	updateCartCount();
	showToast('商品已添加到购物车', 'success');
}

function buyNowHandler() {
	addToCartHandler();
	location.href = 'cart.html';
}

// 复用产品列表中的工具（如果存在）
function updateCartCount() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const cartCountElement = document.getElementById('cartCount');
	if (cartCountElement) {
		const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
		cartCountElement.textContent = totalItems;
	}
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

	const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 2500 });
	bsToast.show();
	toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

