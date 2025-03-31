import { getAllProducts, getProductsByCategory, searchProducts, sortProducts, Product } from './products';

document.addEventListener('DOMContentLoaded', async function() {
  const productContainer = document.getElementById('product-container');
  const sortSelect = document.getElementById('sort-products');
  const searchInput = document.getElementById('search-products');
  const categoryFilters = document.querySelectorAll('.category-filter');
  
  let allProducts: Product[] = [];
  let currentProducts: Product[] = [];
  
  try {
    // Încarcă toate produsele
    allProducts = await getAllProducts();
    currentProducts = [...allProducts];
    
    // Afișează produsele inițiale
    renderProducts(currentProducts);
    
    // Eveniment pentru sortare
    if (sortSelect) {
      sortSelect.addEventListener('change', function(e) {
        const target = e.target as HTMLSelectElement;
        currentProducts = sortProducts(currentProducts, target.value);
        renderProducts(currentProducts);
      });
    }
    
    // Eveniment pentru căutare
    if (searchInput) {
      searchInput.addEventListener('input', debounce(async function(e: Event) {
        const target = e.target as HTMLInputElement;
        const searchTerm = target.value.trim();
        
        if (searchTerm.length === 0) {
          currentProducts = [...allProducts];
        } else {
          currentProducts = await searchProducts(searchTerm);
        }
        
        renderProducts(currentProducts);
      }, 300) as EventListener);
    }
    
    // Eveniment pentru filtrarea după categorie
    if (categoryFilters) {
      categoryFilters.forEach(filter => {
        filter.addEventListener('click', async (e: Event) => {
          e.preventDefault();
          
          // Elimină clasa active de pe toate filtrele
          categoryFilters.forEach(f => f.classList.remove('active'));
          
          // Adaugă clasa active pe filtrul curent
          const clickedElement = e.currentTarget as HTMLElement;
          clickedElement.classList.add('active');
          
          const category = clickedElement.getAttribute('data-category') || 'all';
          
          if (category === 'all') {
            currentProducts = [...allProducts];
          } else {
            currentProducts = await getProductsByCategory(category);
          }
          
          renderProducts(currentProducts);
        });
      });
    }
    
  } catch (error) {
    console.error('Eroare la inițializarea paginii de magazin:', error);
    showToast('Eroare la încărcarea produselor. Te rugăm să reîncerci.', 'error');
  }
  
  // Funcție pentru afișarea produselor în UI
  function renderProducts(products: Product[]) {
    if (!productContainer) return;
    
    // Golește containerul
    productContainer.innerHTML = '';
    
    if (products.length === 0) {
      productContainer.innerHTML = `
        <div class="no-products">
          <p>Nu au fost găsite produse care să corespundă criteriilor de căutare.</p>
        </div>
      `;
      return;
    }
    
    // Adaugă fiecare produs în container
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.setAttribute('data-id', product.id);
      productElement.setAttribute('data-price', product.price.toString());
      
      // Generează ratingul cu stele
      const stars = generateStarRating(product.rating);
      
      productElement.innerHTML = `
        <div class="product-image">
          <img src="${product.thumbnail}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">${product.price} Lei</p>
          <div class="rating">
            ${stars}
          </div>
          <p class="description">${product.description}</p>
          <div class="product-actions">
            <div class="quantity">
              <button class="qty-btn minus">-</button>
              <input type="number" class="qty-input" value="1" min="1" max="10">
              <button class="qty-btn plus">+</button>
            </div>
            <button class="btn-small add-to-cart">Adaugă în coș</button>
          </div>
        </div>
      `;
      
      productContainer.appendChild(productElement);
      
      // Adaugă eveniment pentru butonul de cantitate
      const minusBtn = productElement.querySelector('.minus');
      const plusBtn = productElement.querySelector('.plus');
      const qtyInput = productElement.querySelector('.qty-input') as HTMLInputElement;
      
      if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', function() {
          let value = parseInt(qtyInput.value);
          if (value > 1) {
            qtyInput.value = (value - 1).toString();
          }
        });
        
        plusBtn.addEventListener('click', function() {
          let value = parseInt(qtyInput.value);
          if (value < 10) {
            qtyInput.value = (value + 1).toString();
          }
        });
      }
      
      // Adaugă eveniment pentru butonul de adăugare în coș
      const addToCartBtn = productElement.querySelector('.add-to-cart');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
          const productId = product.id;
          const productName = product.name;
          const productPrice = product.price;
          const productImage = product.thumbnail;
          const quantity = parseInt(qtyInput.value);
          
          // Folosim funcția globală addToCart din script.js
          window.addToCart(productId, productName, productPrice, productImage, quantity);
        });
      }
    });
  }
  
  // Generează ratingul cu stele
  function generateStarRating(rating: number): string {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  }
  
  // Funcție de debounce pentru căutare
  function debounce(func: Function, delay: number = 300): EventListener {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: any, ...args: any[]) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    } as EventListener;
  }
  
  // Funcție pentru afișarea toast notifications
  function showToast(message: string, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
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
});

// Add TypeScript declaration for global addToCart function
declare global {
  interface Window {
    addToCart: (id: string, name: string, price: number, image: string, quantity: number) => void;
  }
}
