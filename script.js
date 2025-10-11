let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.faq-icon');
    answer.classList.toggle('active');
    icon.classList.toggle('active');
}

function selectRole(role) {
    document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('active'));
    event.target.closest('.role-option').classList.add('active');
    
    document.getElementById('producerForm').classList.add('hidden');
    document.getElementById('restaurantForm').classList.add('hidden');
    document.getElementById('clientForm').classList.add('hidden');
    
    if (role === 'producer') {
        document.getElementById('producerForm').classList.remove('hidden');
    } else if (role === 'restaurant') {
        document.getElementById('restaurantForm').classList.remove('hidden');
    } else if (role === 'client') {
        document.getElementById('clientForm').classList.remove('hidden');
    }
}

if (document.getElementById('producerForm')) {
    document.getElementById('producerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            id: Date.now(),
            role: 'producer',
            name: document.getElementById('producerName').value,
            productionType: document.getElementById('productionType').value,
            location: document.getElementById('producerLocation').value,
            email: document.getElementById('producerEmail').value,
            phone: document.getElementById('producerPhone').value,
            description: document.getElementById('producerDescription').value,
            image: document.getElementById('producerImage').value || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(document.getElementById('producerName').value) + '&background=1DB954&color=fff',
            password: document.getElementById('producerPassword').value
        };
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showToast('Inscription réussie ! Redirection...');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    });
}

if (document.getElementById('restaurantForm')) {
    document.getElementById('restaurantForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            id: Date.now(),
            role: 'restaurant',
            name: document.getElementById('restaurantName').value,
            specialty: document.getElementById('restaurantSpecialty').value,
            location: document.getElementById('restaurantLocation').value,
            email: document.getElementById('restaurantEmail').value,
            phone: document.getElementById('restaurantPhone').value,
            description: document.getElementById('restaurantDescription').value,
            image: document.getElementById('restaurantImage').value || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(document.getElementById('restaurantName').value) + '&background=1DB954&color=fff',
            password: document.getElementById('restaurantPassword').value
        };
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showToast('Inscription réussie ! Redirection...');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    });
}

if (document.getElementById('clientForm')) {
    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            id: Date.now(),
            role: 'client',
            name: document.getElementById('clientName').value,
            address: document.getElementById('clientAddress').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            password: document.getElementById('clientPassword').value
        };
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showToast('Inscription réussie ! Redirection...');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    });
}

function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showToast('Connexion réussie ! Redirection...');
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        } else {
            showToast('Email ou mot de passe incorrect');
        }
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

if (window.location.pathname.includes('dashboard.html')) {
    if (!currentUser) {
        window.location.href = 'register.html';
    } else {
        document.getElementById('userName').textContent = `Bienvenue, ${currentUser.name}`;
        document.getElementById('userRole').textContent = currentUser.role === 'producer' ? 'Producteur' : currentUser.role === 'restaurant' ? 'Restaurateur' : 'Client';
        
        if (currentUser.role === 'producer' || currentUser.role === 'restaurant') {
            document.getElementById('producerActions').classList.remove('hidden');
            document.getElementById('producerDashboard').classList.remove('hidden');
            loadMyProducts();
        } else {
            document.getElementById('clientDashboard').classList.remove('hidden');
            loadAllProducts();
        }
    }
}

function showProductModal() {
    document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    document.getElementById('productForm').reset();
}

if (document.getElementById('productForm')) {
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const product = {
            id: Date.now(),
            sellerId: currentUser.id,
            sellerName: currentUser.name,
            name: document.getElementById('productName').value,
            image: document.getElementById('productImage').value || 'images/product-sample.jpg',
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            quantity: document.getElementById('productQuantity').value,
            price: parseFloat(document.getElementById('productPrice').value),
            location: document.getElementById('productLocation').value
        };
        
        allProducts.push(product);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        
        showToast('Produit publié avec succès !');
        closeProductModal();
        loadMyProducts();
    });
}

function loadMyProducts() {
    const myProducts = allProducts.filter(p => p.sellerId === currentUser.id);
    const container = document.getElementById('myProducts');
    
    if (myProducts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun produit publié</h3><p>Commencez à publier vos produits pour les rendre visibles aux acheteurs</p></div>';
    } else {
        container.innerHTML = myProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/product-sample.jpg'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p style="color: var(--text-gray); margin-bottom: 0.5rem;">${product.description}</p>
                    <div class="product-price">${product.price.toFixed(2)} €</div>
                    <div class="product-location">📍 ${product.location}</div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button onclick="deleteProduct(${product.id})" class="btn btn-secondary" style="flex: 1; padding: 0.5rem;">Supprimer</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        allProducts = allProducts.filter(p => p.id !== productId);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        showToast('Produit supprimé');
        loadMyProducts();
    }
}

function loadAllProducts() {
    const container = document.getElementById('allProducts');
    
    if (allProducts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun produit disponible</h3><p>Les producteurs n\'ont pas encore publié de produits</p></div>';
    } else {
        displayProducts(allProducts);
    }
}

function displayProducts(products) {
    const container = document.getElementById('allProducts');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun produit trouvé</h3><p>Essayez une autre recherche</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/product-sample.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p style="color: var(--text-gray); margin-bottom: 0.5rem;">${product.description.substring(0, 80)}...</p>
                <div class="product-price">${product.price.toFixed(2)} €</div>
                <div class="product-location">📍 ${product.location}</div>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    let filtered = allProducts;
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    displayProducts(filtered);
}

function viewProduct(productId) {
    localStorage.setItem('selectedProduct', productId);
    window.location.href = 'product.html';
}

if (window.location.pathname.includes('product.html')) {
    const productId = parseInt(localStorage.getItem('selectedProduct'));
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('productDetailImage').src = product.image;
        document.getElementById('productDetailImage').alt = product.name;
        document.getElementById('productDetailName').textContent = product.name;
        document.getElementById('productDetailCategory').textContent = product.category;
        document.getElementById('productDetailDescription').textContent = product.description;
        document.getElementById('productDetailPrice').textContent = product.price.toFixed(2) + ' €';
        document.getElementById('productDetailQuantity').textContent = product.quantity;
        document.getElementById('productDetailLocation').textContent = product.location;
        document.getElementById('productDetailSeller').textContent = product.sellerName;
    }
}

function addToCartFromDetail() {
    const productId = parseInt(localStorage.getItem('selectedProduct'));
    addToCart(productId);
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
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
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Produit ajouté au panier !');
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

if (window.location.pathname.includes('cart.html')) {
    displayCart();
}

function displayCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    const empty = document.getElementById('emptyCart');
    
    updateCartCount();
    
    if (cart.length === 0) {
        container.innerHTML = '';
        summary.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        summary.classList.remove('hidden');
        
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/product-sample.jpg'">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p style="color: var(--text-gray);">${item.sellerName}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="padding: 0 1rem;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-green);">
                        ${(item.price * item.quantity).toFixed(2)} €
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="btn btn-secondary">Supprimer</button>
                </div>
            </div>
        `).join('');
        
        updateCartSummary();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    showToast('Produit retiré du panier');
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
    document.getElementById('shipping').textContent = shipping.toFixed(2) + ' €';
    document.getElementById('total').textContent = total.toFixed(2) + ' €';
}

function placeOrder() {
    if (cart.length === 0) return;
    
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5,
        date: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    showToast('Votre commande a été enregistrée avec succès !');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

if (document.querySelector('.stat-number')) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        });
    }, observerOptions);
    
    statsObserver.observe(document.querySelector('.stat-number'));
}

updateCartCount();
