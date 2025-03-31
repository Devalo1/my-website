// Script pentru meniu responsive și funcționalitate e-commerce
document.addEventListener('DOMContentLoaded', function() {
    // Meniu responsive
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Închide meniul la click în afara meniului
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Verifică dacă utilizatorul este autentificat pentru butonul de profil
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        // Verificăm dacă există un utilizator în localStorage
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        
        if (userLoggedIn) {
            // Dacă utilizatorul este autentificat, redirecționează către pagina de profil
            profileBtn.href = 'profile.html';
            // Opțional: schimbă iconița pentru a indica că utilizatorul este autentificat
            profileBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        }
    }
    
    // Inițializare coș de cumpărături din LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Selectors pentru e-commerce
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    const quantityBtns = document.querySelectorAll('.qty-btn');
    const sortProducts = document.getElementById('sort-products');
    
    // Inițializare toast notifications
    const toastContainer = document.getElementById('toast-container');
    
    // Funcția pentru afișarea notificărilor toast
    function showToast(message, type = 'info') {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle toast-icon"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle toast-icon"></i>';
        }
        
        toast.innerHTML = `
            ${icon}
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
    
    // Event pentru butoanele de cantitate
    if (quantityBtns) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.qty-input');
                const currentValue = parseInt(input.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (this.classList.contains('plus') && currentValue < 10) {
                    input.value = currentValue + 1;
                }
            });
        });
    }
    
    // Event pentru butoanele de adăugare în coș
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const product = this.closest('.product');
                const productId = product.getAttribute('data-id');
                const productName = product.querySelector('h3').textContent;
                const productPrice = parseFloat(product.getAttribute('data-price'));
                const productImage = product.querySelector('img').src;
                const quantity = parseInt(product.querySelector('.qty-input').value);
                
                addToCart(productId, productName, productPrice, productImage, quantity);
            });
        });
    }
    
    // Filtrare și sortare produse
    if (sortProducts) {
        sortProducts.addEventListener('change', function() {
            sortProductList(this.value);
        });
    }
    
    // Deschide modal coș
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            renderCartItems();
        });
    }
    
    // Închide modal coș
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
        
        // Închide modalul la click în afara conținutului
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Eveniment pentru ștergerea coșului
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            clearCart();
        });
    }
    
    // Funcție pentru checkout cu validare
    function processCheckout() {
        if (cart.length === 0) {
            showToast('Coșul tău este gol. Adaugă produse pentru a finaliza comanda.', 'error');
            return false;
        }
        
        window.location.href = 'checkout.html';
        return true;
    }
    
    // Actualizare Eveniment pentru finalizarea comenzii
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            processCheckout();
        });
    }
    
    // Funcții pentru manipularea coșului - actualizate cu toast
    function addToCart(id, name, price, image, quantity) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity
            });
        }
        
        saveCart();
        updateCartCount();
        
        // Notificare adăugat în coș cu toast în loc de alert
        showToast(`${quantity} x ${name} a fost adăugat în coș!`, 'success');
    }
    
    function removeFromCart(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            const name = item.name;
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartCount();
            renderCartItems();
            showToast(`${name} a fost eliminat din coș.`, 'info');
        }
    }
    
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = itemCount;
        }
    }
    
    function updateCartItemQuantity(id, quantity) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            saveCart();
            renderCartItems();
        }
    }
    
    function renderCartItems() {
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Coșul tău este gol</div>';
            cartTotalPrice.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} Lei x ${item.quantity}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-delete" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Event pentru butonul de ștergere
            const deleteBtn = cartItem.querySelector('.cart-item-delete');
            deleteBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeFromCart(id);
            });
            
            // Event pentru butoanele de cantitate
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            
            minusBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    updateCartItemQuantity(id, item.quantity - 1);
                }
            });
            
            plusBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item && item.quantity < 10) {
                    updateCartItemQuantity(id, item.quantity + 1);
                }
            });
        });
        
        cartTotalPrice.textContent = total.toFixed(2);
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function clearCart() {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
    }
    
    function sortProductList(sortType) {
        const productContainer = document.getElementById('product-container');
        if (!productContainer) return;
        
        const products = Array.from(productContainer.querySelectorAll('.product'));
        
        products.sort((a, b) => {
            switch (sortType) {
                case 'price-low':
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                case 'price-high':
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                case 'name-asc':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'name-desc':
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                default:
                    return 0;
            }
        });
        
        // Reattach sorted products to the container
        products.forEach(product => {
            productContainer.appendChild(product);
        });
    }
    
    // Funcționalități pentru pagina de detalii produs
    const productDetailPage = document.querySelector('.product-detail');
    if (productDetailPage) {
        // Schimbare imagine principală la click pe thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-product-image');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Elimină clasa active de pe toate thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Adaugă clasa active pe thumbnail-ul curent
                this.classList.add('active');
                
                // Schimbă imaginea principală
                const newImageSrc = this.getAttribute('data-image');
                mainImage.src = newImageSrc;
            });
        });
        
        // Tab-uri pentru detalii produs
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Elimină clasa active de pe toate butoanele și tab-urile
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Adaugă clasa active pe butonul curent
                this.classList.add('active');
                
                // Afișează tab-ul corespunzător
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Selectare variantă produs
        const variantButtons = document.querySelectorAll('.variant-btn');
        
        variantButtons.forEach(button => {
            button.addEventListener('click', function() {
                variantButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Sistem de rating pentru recenzii
        const ratingStars = document.querySelectorAll('.rating-select i');
        
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                ratingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    
                    if (starRating <= rating) {
                        s.className = 'fas fa-star active';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                ratingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    
                    if (starRating <= rating) {
                        s.className = 'fas fa-star';
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                ratingStars.forEach(s => {
                    if (!s.classList.contains('active')) {
                        s.className = 'far fa-star';
                    }
                });
            });
        });
        
        // Adaugă în coș din pagina de detalii
        const detailAddToCartBtn = document.querySelector('.product-info-detail .add-to-cart');
        
        if (detailAddToCartBtn) {
            detailAddToCartBtn.addEventListener('click', function() {
                const productInfo = document.querySelector('.product-info-detail');
                const productId = productInfo.getAttribute('data-id');
                const productName = productInfo.querySelector('h1').textContent;
                const productPrice = parseFloat(productInfo.getAttribute('data-price'));
                const productImage = document.getElementById('main-product-image').src;
                const quantity = parseInt(productInfo.querySelector('.qty-input').value);
                
                addToCart(productId, productName, productPrice, productImage, quantity);
            });
        }
        
        // Adaugă la wishlist
        const wishlistBtn = document.querySelector('.btn-wishlist');
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                const productName = document.querySelector('.product-info-detail h1').textContent;
                
                // Toggle clasa pentru inimă plină/goală
                const heartIcon = this.querySelector('i');
                
                if (heartIcon.classList.contains('far')) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    showToast(`${productName} a fost adăugat la favorite!`, 'success');
                } else {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                    showToast(`${productName} a fost eliminat de la favorite.`, 'info');
                }
            });
        }
    }
    
    // Funcționalitate formular recenzii
    const reviewForm = document.querySelector('.review-form');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value;
            const email = document.getElementById('review-email').value;
            const text = document.getElementById('review-text').value;
            
            // Verificare dacă s-a selectat un rating
            const activeStars = document.querySelectorAll('.rating-select i.active');
            
            if (activeStars.length === 0) {
                showToast('Te rugăm să selectezi un rating pentru recenzie.', 'error');
                return;
            }
            
            // Aici ar trebui să trimiteți recenzia către server
            // Pentru demo, vom afișa doar un mesaj de succes
            showToast('Recenzia ta a fost trimisă cu succes! Mulțumim pentru feedback.', 'success');
            
            // Reset form
            reviewForm.reset();
            document.querySelectorAll('.rating-select i').forEach(star => {
                star.className = 'far fa-star';
            });
        });
    }
});
