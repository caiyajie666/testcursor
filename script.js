const navToggleButton = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const heroSearchForm = document.getElementById('heroSearchForm');
const heroSearchInput = document.getElementById('heroSearchInput');
const productGrid = document.getElementById('productGrid');

function toggleMobileNav() {
  const isOpen = mobileNav.hasAttribute('hidden') === false;
  if (isOpen) {
    mobileNav.setAttribute('hidden', '');
    navToggleButton.setAttribute('aria-expanded', 'false');
  } else {
    mobileNav.removeAttribute('hidden');
    navToggleButton.setAttribute('aria-expanded', 'true');
  }
}

if (navToggleButton) {
  navToggleButton.addEventListener('click', toggleMobileNav);
}

// Demo product dataset
const products = [
  { id: 1, title: '蓝牙降噪耳机 Pro', price: 39.9, rating: 4.7, image: 'https://images.unsplash.com/photo-1518442933930-0ff277f8d5bb?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, title: '宠物自动喂食器', price: 28.5, rating: 4.6, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, title: '智能运动手表', price: 49.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1518441902113-c1d5bca2dbca?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, title: '北欧极简台灯', price: 19.9, rating: 4.5, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, title: '多功能料理机', price: 34.9, rating: 4.6, image: 'https://images.unsplash.com/photo-1542444459-db63c012d84a?q=80&w=1200&auto=format&fit=crop' },
  { id: 6, title: '户外运动水壶', price: 12.9, rating: 4.4, image: 'https://images.unsplash.com/photo-1508693926297-1d61ee3c1f51?q=80&w=1200&auto=format&fit=crop' },
  { id: 7, title: '电动充气泵', price: 22.9, rating: 4.5, image: 'https://images.unsplash.com/photo-1516570161787-2fd917215a3d?q=80&w=1200&auto=format&fit=crop' },
  { id: 8, title: '车载手机支架', price: 8.9, rating: 4.3, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop' },
];

function renderProducts(list) {
  if (!productGrid) return;
  productGrid.innerHTML = '';
  list.forEach(p => {
    const el = document.createElement('article');
    el.className = 'product';
    el.innerHTML = `
      <div class="product__media">
        <img loading="lazy" src="${p.image}" alt="${p.title}" />
      </div>
      <div class="product__body">
        <h3 class="product__title">${p.title}</h3>
        <div class="product__meta">
          <span class="product__price">$${p.price.toFixed(2)}</span>
          <span title="评分">⭐ ${p.rating.toFixed(1)}</span>
        </div>
        <div class="product__actions">
          <a class="btn btn--ghost" href="#">详情</a>
          <button class="btn btn--primary">加入询盘</button>
        </div>
      </div>
    `;
    productGrid.appendChild(el);
  });
}

renderProducts(products);

function handleSearchSubmit(evt, inputEl) {
  evt.preventDefault();
  const q = (inputEl.value || '').trim().toLowerCase();
  if (!q) {
    renderProducts(products);
    return;
  }
  const filtered = products.filter(p => p.title.toLowerCase().includes(q));
  renderProducts(filtered);
  const featuredSection = document.getElementById('featured');
  if (featuredSection) {
    featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (e) => handleSearchSubmit(e, searchInput));
}

if (heroSearchForm && heroSearchInput) {
  heroSearchForm.addEventListener('submit', (e) => handleSearchSubmit(e, heroSearchInput));
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}