// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Organic Tomatoes",
        description: "Fresh, vine-ripened organic tomatoes. Perfect for salads and cooking.",
        price: 4.99,
        category: "vegetables",
        icon: "🍅"
    },
    {
        id: 2,
        name: "Farm Fresh Eggs",
        description: "Free-range chicken eggs from our happy hens.",
        price: 6.99,
        category: "dairy",
        icon: "🥚"
    },
    {
        id: 3,
        name: "Organic Lettuce",
        description: "Crisp, fresh lettuce grown without pesticides.",
        price: 3.49,
        category: "vegetables",
        icon: "🥬"
    },
    {
        id: 4,
        name: "Sweet Corn",
        description: "Sweet, tender corn picked fresh daily.",
        price: 5.99,
        category: "vegetables",
        icon: "🌽"
    },
    {
        id: 5,
        name: "Fresh Strawberries",
        description: "Sweet, juicy strawberries perfect for desserts.",
        price: 7.99,
        category: "fruits",
        icon: "🍓"
    },
    {
        id: 6,
        name: "Organic Carrots",
        description: "Crunchy, sweet carrots grown in rich soil.",
        price: 3.99,
        category: "vegetables",
        icon: "🥕"
    },
    {
        id: 7,
        name: "Fresh Herbs Bundle",
        description: "Mixed herbs including basil, parsley, and cilantro.",
        price: 4.49,
        category: "herbs",
        icon: "🌿"
    },
    {
        id: 8,
        name: "Seasonal Fruit Mix",
        description: "A variety of seasonal fruits picked fresh daily.",
        price: 12.99,
        category: "fruits",
        icon: "🍎"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    products = sampleProducts;
    renderProducts();
    updateCartCount();
    setupEventListeners();
    setupPaymentHandlers();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }

    // Cart modal
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Cart actions
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navList.classList.remove('active');
            }
        });
    });
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.icon}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showAlert('Product added to cart!', 'success');
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Open cart modal
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!modal || !cartItems || !cartTotal) return;

    // Render cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4444; color: white; margin-left: 10px;">×</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    modal.style.display = 'block';
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        saveCart();
        openCartModal(); // Refresh modal
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCart();
    openCartModal(); // Refresh modal
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartCount();
    saveCart();
    openCartModal(); // Refresh modal
    showAlert('Cart cleared', 'success');
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    closeModals();
    openCheckoutModal();
}

// Open checkout modal
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!modal || !checkoutItems || !checkoutTotal) return;

    // Render checkout items
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = total.toFixed(2);

    modal.style.display = 'block';
}

// Setup payment handlers
function setupPaymentHandlers() {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const cardForm = document.getElementById('card-form');
    const altPaymentInfo = document.getElementById('alt-payment-info');
    
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paymentButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const paymentType = this.id.replace('-btn', '');
            handlePaymentSelection(paymentType);
        });
    });

    // Credit card form handling
    const processPaymentBtn = document.getElementById('process-payment');
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processCardPayment);
    }

    // Alternative payment confirmation
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmAlternativePayment);
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}

// Handle payment selection
function handlePaymentSelection(paymentType) {
    const cardForm = document.getElementById('card-form');
    const altPaymentInfo = document.getElementById('alt-payment-info');
    
    if (!cardForm || !altPaymentInfo) return;

    if (paymentType === 'card') {
        cardForm.style.display = 'block';
        altPaymentInfo.style.display = 'none';
    } else {
        cardForm.style.display = 'none';
        altPaymentInfo.style.display = 'block';
        showAlternativePaymentInfo(paymentType);
    }
}

// Show alternative payment info
function showAlternativePaymentInfo(paymentType) {
    const paymentDetails = document.querySelector('.payment-details');
    if (!paymentDetails) return;

    const paymentInfo = {
        'apple-pay': {
            title: 'Apple Pay',
            instructions: 'Click "Confirm Payment" to proceed with Apple Pay checkout. You will be redirected to complete your payment securely.',
            icon: '🍎'
        },
        'venmo': {
            title: 'Venmo',
            instructions: 'Send payment to: @camachos-farms<br>Please include your order number in the payment note.',
            icon: '📱'
        },
        'cashapp': {
            title: 'Cash App',
            instructions: 'Send payment to: $CamachosFarms<br>Please include your order number in the payment note.',
            icon: '💰'
        },
        'zelle': {
            title: 'Zelle',
            instructions: 'Send payment to: payments@camachosfarms.com<br>Please include your order number in the payment note.',
            icon: '📲'
        },
        'square': {
            title: 'Square',
            instructions: 'You will be redirected to Square\'s secure payment portal to complete your transaction.',
            icon: '⬛'
        }
    };

    const info = paymentInfo[paymentType];
    if (info) {
        paymentDetails.innerHTML = `
            <h4>${info.icon} ${info.title} Payment</h4>
            <p>${info.instructions}</p>
            <p><strong>Order Total: $${getCartTotal().toFixed(2)}</strong></p>
        `;
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Process card payment
function processCardPayment() {
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholder-name').value;

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        showAlert('Please fill in all card details', 'error');
        return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
        showAlert('Please enter a valid card number', 'error');
        return;
    }

    if (cvv.length < 3) {
        showAlert('Please enter a valid CVV', 'error');
        return;
    }

    // Simulate payment processing
    const processBtn = document.getElementById('process-payment');
    const originalText = processBtn.textContent;
    processBtn.innerHTML = '<span class="loading"></span> Processing...';
    processBtn.disabled = true;

    setTimeout(() => {
        processBtn.innerHTML = originalText;
        processBtn.disabled = false;
        completeOrder('Credit Card');
    }, 2000);
}

// Confirm alternative payment
function confirmAlternativePayment() {
    const activePayment = document.querySelector('.payment-btn.active');
    if (!activePayment) {
        showAlert('Please select a payment method', 'error');
        return;
    }

    const paymentType = activePayment.textContent.trim();
    
    // Simulate order processing
    const confirmBtn = document.getElementById('confirm-payment');
    const originalText = confirmBtn.textContent;
    confirmBtn.innerHTML = '<span class="loading"></span> Processing...';
    confirmBtn.disabled = true;

    setTimeout(() => {
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
        completeOrder(paymentType);
    }, 1500);
}

// Complete order
function completeOrder(paymentMethod) {
    const orderNumber = Math.floor(Math.random() * 1000000);
    
    showAlert(`Order #${orderNumber} placed successfully! Payment method: ${paymentMethod}`, 'success');
    
    // Clear cart
    cart = [];
    updateCartCount();
    saveCart();
    
    // Close modals
    closeModals();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Close all modals
function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
        showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
    }, 1500);
}

// Show alert messages
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insert alert at the top of the page
    document.body.insertBefore(alert, document.body.firstChild);

    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Apple Pay availability check
function checkApplePayAvailability() {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        return true;
    }
    return false;
}

// Initialize Apple Pay (if available)
function initializeApplePay() {
    const applePayBtn = document.getElementById('apple-pay-btn');
    if (applePayBtn && !checkApplePayAvailability()) {
        applePayBtn.style.opacity = '0.5';
        applePayBtn.title = 'Apple Pay is not available on this device';
    }
}

// Handle Apple Pay payment
function handleApplePayment() {
    if (!checkApplePayAvailability()) {
        showAlert('Apple Pay is not available on this device', 'error');
        return;
    }

    const total = getCartTotal();
    
    // This would be implemented with actual Apple Pay SDK
    showAlert('Apple Pay integration would be implemented here with proper merchant configuration', 'info');
    
    // For demo purposes, simulate successful payment
    setTimeout(() => {
        completeOrder('Apple Pay');
    }, 2000);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Call scroll animations setup after DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupScrollAnimations, 100);
});

// PWA Service Worker Registration (for future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}