// --- Product Ecosystem Data ---
const products = [
    { id: 1, name: "Neural Phone 1", category: "smartphones", price: 85000, img: "assets/smartphone.png", desc: "The defining core device. Features a 175-core neural engine, quantum-dot display, and seamless link to your identity.", badge: "New Gen" },
    { id: 2, name: "Quantum Watch S", category: "wearables", price: 34000, img: "assets/watch.png", desc: "Biometric monitoring perfected. Real-time neural feedback and satellite connectivity in a carbon-fiber shell.", badge: "Bestseller" },
    { id: 3, name: "Core Workstation 16", category: "computing", price: 145000, img: "assets/laptop.png", desc: "Infinite power, redefined. The lightest high-performance workstation ever built, powered by the NEON Flux chipset.", badge: "Limited" },
    { id: 4, name: "Sync Pods Pro", category: "audio", price: 24000, img: "assets/smartphone.png", desc: "Immersion without compromise. Active neural noise cancellation and ultra-wide-band spatial audio.", badge: "Must Have" },
    { id: 5, name: "Nebula Tablet 12", category: "computing", price: 62000, img: "assets/laptop.png", desc: "Your creative canvas. A 120Hz liquid retina display with support for the NEON Pen and instant neural desktop.", badge: "" },
    { id: 6, name: "Vector Drone X", category: "smartphones", price: 48000, img: "assets/smartphone.png", desc: "Autonomous flight, human creative control. 8K neural camera stabilizing with zero-latency transmission.", badge: "Pro" },
];

let cart = JSON.parse(localStorage.getItem('neon_cart')) || [];
let orders = JSON.parse(localStorage.getItem('neon_orders')) || [];

// --- Global DOM Elements ---
const viewContainer = document.getElementById('view-container');
const tplHome = document.getElementById('tpl-home');
const tplShop = document.getElementById('tpl-shop');
const tplProduct = document.getElementById('tpl-product');
const tplAbout = document.getElementById('tpl-about');

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const ordersDrawer = document.getElementById('orders-drawer');
const ordersOverlay = document.getElementById('orders-overlay');
const searchOverlay = document.getElementById('search-overlay');
const cartCountEl = document.querySelector('.cart-count');
const cartTotalEl = document.getElementById('cart-total-price');
const cartItemsList = document.getElementById('cart-items-list');
const ordersList = document.getElementById('orders-list');
const checkoutBtn = document.getElementById('checkout-btn');

// --- SPA Router Implementation ---
window.addEventListener('hashchange', handleRoute);

// High-reliability initialization
if (document.readyState === 'loading') {
    window.addEventListener('load', initialize);
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

function initialize() {
    handleRoute();
    updateCartUI();
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const [path, query] = hash.split('?');
    
    closeAllOverlays();

    if (path === '#home') {
        renderHome();
    } else if (path === '#shop') {
        const cat = new URLSearchParams(query).get('cat') || 'all';
        renderShop(cat);
    } else if (path.startsWith('#product/')) {
        const id = parseInt(path.split('/')[1]);
        renderProductDetail(id);
    } else if (path === '#about') {
        renderAbout();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- View Renderers ---
function renderHome() {
    viewContainer.innerHTML = tplHome.innerHTML;
    const featuredList = document.getElementById('featured-products');
    if (featuredList) {
        featuredList.innerHTML = generateProductGridHTML(products.slice(0, 3));
    }
}

function renderShop(category = 'all') {
    viewContainer.innerHTML = tplShop.innerHTML;
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    const productGrid = document.getElementById('shop-product-list');
    productGrid.innerHTML = generateProductGridHTML(filtered);
    
    // Setup Filter Events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === category);
        btn.onclick = () => window.location.hash = `#shop?cat=${btn.dataset.cat}`;
    });
}

function renderProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return renderHome();

    viewContainer.innerHTML = tplProduct.innerHTML;
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; padding-top: 50px;" class="animate">
            <div style="background: #000; padding: 40px; border: 1px solid var(--border);">
                <img src="${product.img}" alt="${product.name}" style="width: 100%; height: auto; object-fit: contain;">
            </div>
            <div style="padding-top: 40px;">
                <span style="color: var(--primary); font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase;">Reference_${product.id}</span>
                <h1 style="font-size: 4rem; margin-bottom: 20px;">${product.name}</h1>
                <p style="font-size: 2rem; color: #fff; margin-bottom: 40px; font-family: var(--heading-font);">₹${product.price.toLocaleString()}.00</p>
                <div style="color: var(--text-muted); line-height: 2; margin-bottom: 60px;">${product.desc}</div>
                <button class="btn-neon" onclick="addToCart(${product.id})" style="width: 100%;">Connect to System</button>
                <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.8rem; opacity: 0.5;">
                    <p><i class="fa-solid fa-satellite"></i> Linked Tracking</p>
                    <p><i class="fa-solid fa-microchip"></i> Hardware Warranty</p>
                </div>
            </div>
        </div>
    `;
}

function renderAbout() {
    viewContainer.innerHTML = tplAbout.innerHTML;
}

// --- Helper Functions ---
function generateProductGridHTML(data) {
    return data.map(product => `
        <div class="product-card animate">
            <div class="product-img" onclick="window.location.hash='#product/${product.id}'">
                ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
                <img src="${product.img}" alt="${product.name}">
                <div class="add-cart-overlay">
                    <button class="btn-neon" style="padding: 10px 25px; font-size: 0.7rem;" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Core</button>
                </div>
            </div>
            <div class="product-content" onclick="window.location.hash='#product/${product.id}'">
                <p class="product-cat">${product.category}</p>
                <h4 class="product-title">${product.name}</h4>
                <div class="product-bottom">
                    <span class="price">₹${product.price.toLocaleString()}</span>
                    <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem; opacity: 0.5;"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Core State Management ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    saveState();
    updateCartUI();
    openCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    saveState();
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.innerText = count;
    
    cartItemsList.innerHTML = cart.length === 0 
        ? '<div style="text-align: center; margin-top: 100px; opacity: 0.3;"><i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 20px;"></i><p>Manifest is empty.</p></div>'
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div style="flex: 1;">
                    <h5 style="margin-bottom: 5px;">${item.name}</h5>
                    <p style="color: var(--primary); font-family: var(--heading-font);">₹${item.price.toLocaleString()}</p>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                        <button onclick="updateQty(${item.id}, -1)" style="color: #fff; width: 25px; height: 25px; border: 1px solid var(--border);">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)" style="color: #fff; width: 25px; height: 25px; border: 1px solid var(--border);">+</button>
                    </div>
                </div>
                <button onclick="updateQty(${item.id}, -${item.qty})" style="color: #ff4444; opacity: 0.5;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalEl.innerText = `₹${total.toLocaleString()}.00`;
}

function saveState() {
    localStorage.setItem('neon_cart', JSON.stringify(cart));
}

// --- Overlay Controls ---
function openCart() { cartDrawer.classList.add('active'); cartOverlay.classList.add('active'); }
function closeCart() { cartDrawer.classList.remove('active'); cartOverlay.classList.remove('active'); }

function openOrders() { ordersDrawer.classList.add('active'); ordersOverlay.classList.add('active'); renderOrders(); }
function closeOrders() { ordersDrawer.classList.remove('active'); ordersOverlay.classList.remove('active'); }

function openSearch() { searchOverlay.classList.add('active'); document.getElementById('search-input').focus(); }
function closeSearch() { searchOverlay.classList.remove('active'); }

function closeAllOverlays() {
    closeCart(); closeOrders(); closeSearch();
}

// --- Search Protocol ---
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    resultsContainer.innerHTML = generateProductGridHTML(filtered);
});

// --- Order Protocol ---
function finalizeTransaction() {
    if (cart.length === 0) return alert('Cannot finalize empty manifest.');
    const orderID = 'SYS-' + Math.floor(Math.random() * 10000000);
    const newOrder = {
        id: orderID,
        timestamp: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
    };
    orders.unshift(newOrder);
    localStorage.setItem('neon_orders', JSON.stringify(orders));
    cart = [];
    saveState();
    updateCartUI();
    closeCart();
    alert(`Transaction Finalized. Order ID: ${orderID}`);
}

function renderOrders() {
    ordersList.innerHTML = orders.length === 0 
        ? '<div style="text-align: center; margin-top: 100px; opacity: 0.3;"><p>No protocol logs found.</p></div>' 
        : orders.map(order => `
            <div style="border: 1px solid var(--border); padding: 20px; margin-bottom: 20px; background: rgba(255,255,255,0.02);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong style="color: var(--primary);">${order.id}</strong>
                    <span style="font-size: 0.7rem; opacity: 0.4;">${new Date(order.timestamp).toLocaleDateString()}</span>
                </div>
                <div style="font-size: 0.8rem; opacity: 0.7;">
                    ${order.items.map(item => `${item.name} [x${item.qty}]`).join(', ')}
                </div>
                <div style="text-align: right; margin-top: 15px; font-weight: 700;">₹${order.total.toLocaleString()}</div>
            </div>
        `).join('');
}

// --- Event Listeners ---
document.getElementById('cart-toggle').onclick = openCart;
document.getElementById('close-cart').onclick = closeCart;
cartOverlay.onclick = closeCart;

document.getElementById('orders-toggle').onclick = openOrders;
document.getElementById('close-orders').onclick = closeOrders;
ordersOverlay.onclick = closeOrders;

document.getElementById('search-toggle').onclick = openSearch;
document.getElementById('close-search').onclick = closeSearch;

checkoutBtn.onclick = finalizeTransaction;
