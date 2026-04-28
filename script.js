// --- 1. Product Data ---
const products = [
    { id: 1, name: "Terracotta Clay Vase", price: 1200, img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Woven Macrame Wall Art", price: 2500, img: "https://images.unsplash.com/photo-1528458618843-16279f53e6b7?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Rustic Wooden Candle Holder", price: 850, img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Hand-poured Soy Candle", price: 450, img: "https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=400&q=80" }
];

let cart = [];

// --- 2. DOM Elements ---
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Overlays & Sections
const cartOverlay = document.getElementById('cart-overlay');
const checkoutModal = document.getElementById('checkout-modal');
const userDetailsSection = document.getElementById('user-details-section');
const paymentSection = document.getElementById('payment-section');
const successSection = document.getElementById('success-section');

// --- 3. Render Products ---
function renderProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <button class="btn primary-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

// --- 4. Cart Logic ---
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    cartOverlay.classList.remove('hidden'); // Open cart on add
}

function updateCartUI() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsContainer.innerHTML = '';
    
    let totalAmount = 0;
    cart.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>₹${item.price} x ${item.quantity}</small>
            </div>
            <div>
                <strong>₹${item.price * item.quantity}</strong>
                <button onclick="removeFromCart(${index})" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer;">X</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotal.innerText = totalAmount;
    checkoutBtn.disabled = cart.length === 0;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// --- 5. Navigation & Modal Logic ---
document.getElementById('cart-btn').addEventListener('click', () => cartOverlay.classList.remove('hidden'));
document.getElementById('close-cart').addEventListener('click', () => cartOverlay.classList.add('hidden'));
document.getElementById('close-checkout').addEventListener('click', () => checkoutModal.classList.add('hidden'));

checkoutBtn.addEventListener('click', () => {
    cartOverlay.classList.add('hidden');
    checkoutModal.classList.remove('hidden');
    userDetailsSection.classList.remove('hidden');
    paymentSection.classList.add('hidden');
    successSection.classList.add('hidden');
});

// --- 6. Checkout & QR Generation ---
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('pay-amount').innerText = total;

    // Generate UPI QR Code URL
    // Format: upi://pay?pa=YOUR_UPI_ID&pn=YOUR_BUSINESS_NAME&am=AMOUNT&cu=INR
    const upiId = "yourbusiness@ybl"; // Replace with your actual merchant UPI ID
    const businessName = "Artisan Decor";
    const upiString = `upi://pay?pa=${upiId}&pn=${businessName}&am=${total}&cu=INR`;
    
    // Using goqr.me API to generate the QR image based on the UPI string
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
    document.getElementById('qr-code-img').src = qrApiUrl;

    // Transition to Payment Section
    userDetailsSection.classList.add('hidden');
    paymentSection.classList.remove('hidden');
});

// --- 7. Order Confirmation Simulation ---
document.getElementById('confirm-payment-btn').addEventListener('click', () => {
    // Transition to Success Section
    paymentSection.classList.add('hidden');
    successSection.classList.remove('hidden');
    
    // Clear the cart
    cart = [];
    updateCartUI();
});

document.getElementById('finish-btn').addEventListener('click', () => {
    checkoutModal.classList.add('hidden');
});

// Init
renderProducts();
