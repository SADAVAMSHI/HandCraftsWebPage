// --- 1. Product Data ---
const products = [
    { id: 1, name: "Terracotta Clay Vase", price: 1200, img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Woven Macrame Wall Art", price: 2500, img: "https://images.unsplash.com/photo-1528458618843-16279f53e6b7?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Rustic Wooden Candle Holder", price: 850, img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Hand-poured Soy Candle", price: 450, img: "https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=400&q=80" }
];

let cart = [];
let customerDetails = {}; 

// --- 2. DOM Elements (Loaded after DOM is ready) ---
let productGrid, cartCount, cartItemsContainer, cartTotal, checkoutBtn;
let cartOverlay, checkoutModal, userDetailsSection, paymentSection, successSection;

// --- 3. Render Products ---
function renderProducts() {
    // Clear the grid first just in case
    productGrid.innerHTML = ''; 
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Found'">
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
    cartOverlay.classList.remove('hidden'); 
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
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
                <button onclick="removeFromCart(${index})" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer; font-weight: bold;">X</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotal.innerText = totalAmount;
    checkoutBtn.disabled = cart.length === 0;
}

// --- 5. Initialize Everything when Page Loads ---
document.addEventListener('DOMContentLoaded', () => {
    // Grab all elements
    productGrid = document.getElementById('product-grid');
    cartCount = document.getElementById('cart-count');
    cartItemsContainer = document.getElementById('cart-items');
    cartTotal = document.getElementById('cart-total');
    checkoutBtn = document.getElementById('checkout-btn');
    
    cartOverlay = document.getElementById('cart-overlay');
    checkoutModal = document.getElementById('checkout-modal');
    userDetailsSection = document.getElementById('user-details-section');
    paymentSection = document.getElementById('payment-section');
    successSection = document.getElementById('success-section');

    // Render the products initially
    renderProducts();

    // Event Listeners for Modals
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

    // Checkout Form Submit (Generate QR)
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        customerDetails = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('pay-amount').innerText = total;

        const upiId = "yourbusiness@ybl"; // <-- UPDATE THIS
        const businessName = "Artisan Decor";
        const upiString = `upi://pay?pa=${upiId}&pn=${businessName}&am=${total}&cu=INR`;
        
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
        document.getElementById('qr-code-img').src = qrApiUrl;

        userDetailsSection.classList.add('hidden');
        paymentSection.classList.remove('hidden');
    });

    // WhatsApp Confirmation
    document.getElementById('confirm-payment-btn').addEventListener('click', () => {
        const orderSummary = cart.map(item => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const whatsappMessage = `*🎉 NEW ORDER PLACED 🎉*\n\n*Customer Details:*\nName: ${customerDetails.name}\nEmail: ${customerDetails.email}\nAddress: ${customerDetails.address}\n\n*Order Summary:*\n${orderSummary}\n\n*Total Amount Paid:* ₹${totalAmount}\n\n_Note: I have completed the payment via the UPI QR code._`;

        const myPhoneNumber = "919876543210"; // <-- UPDATE THIS WITH YOUR 10 DIGIT NUMBER
        
        const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        paymentSection.classList.add('hidden');
        successSection.classList.remove('hidden');
        
        cart = [];
        updateCartUI();
    });

    // Finish button
    document.getElementById('finish-btn').addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });
});
