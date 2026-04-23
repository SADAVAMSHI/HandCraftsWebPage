// Function to open the checkout section and populate the selected produc
function openCheckout(productName, price) {
    const checkoutSection = document.getElementById('checkout');
    const orderSummary = document.querySelector('#order-summary span');
    
    // Unhide the checkout section
    checkoutSection.classList.remove('hidden');
    
    // Update the text to show what the user is buying
    orderSummary.textContent = `${productName} (₹${price})`;
    
    // Scroll down to the checkout section smoothly
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission
document.getElementById('order-form').addEventListener('submit', function(event) {
    // Prevent the page from refreshing when clicking submit
    event.preventDefault();
    
    // Grab the values from the form
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    // In a real application, you would send this data to a backend server here.
    // For now, we will just show a success message.
    
    alert(`Thank you, ${name}! Your order has been placed successfully. We will contact you at ${phone} regarding shipping.`);
    
    // Reset the form
    this.reset();
    
    
    document.getElementById('checkout').classList.add('hidden');
})