/**
 * CONTROLLER UNIFICAT PENTRU BUTONUL DE PROFIL PE DESKTOP
 * 
 * Acest fișier este SINGURA sursă de funcționalitate pentru butonul de profil
 * pe dispozitive desktop. Toate acțiunile și interacțiunile utilizatorului
 * cu profilul sunt gestionate aici pentru a evita conflictele.
 */

(function() {
    // IMPORTANT: RULEAZĂ STRICT DOAR PE DESKTOP
    if (window.innerWidth <= 768 || document.documentElement.clientWidth <= 768) {
        console.log('utilizator-button-function-desktop.js: Ecran mobil detectat, script oprit.');
        return;
    }

    // Anunță în mod explicit că acest controller este pentru DESKTOP
    console.log('Inițializare controller buton utilizator DESKTOP');
    
    // Flag pentru a preveni dublarea inițializării
    window.DESKTOP_USER_BUTTON_INITIALIZED = window.DESKTOP_USER_BUTTON_INITIALIZED || false;
    
    // Dacă a fost deja inițializat, nu executa din nou
    if (window.DESKTOP_USER_BUTTON_INITIALIZED) {
        console.log('Butonul utilizator desktop a fost deja inițializat.');
        return;
    }
    
    // Setează flag-ul de inițializare
    window.DESKTOP_USER_BUTTON_INITIALIZED = true;
    
    // Fă funcțiile disponibile global cu prefix DESKTOP pentru claritate
    window.DesktopUserButton = {};
    
    /**
     * Inițializează butonul de profil pe desktop
     */
    function initialize() {
        console.log('Inițializare controller buton utilizator desktop');
        
        // Găsește butonul de profil desktop
        const profileButton = document.querySelector('.header-profile') || 
                             document.querySelector('.profile:not(#profile-button-v7)');
                             
        if (!profileButton) {
            console.warn('Butonul de profil desktop nu a fost găsit!');
            return;
        }
        
        // Adaugă evenimentul de click principal care va gestiona toate interacțiunile
        profileButton.addEventListener('click', handleProfileButtonClick);
        
        // Încarcă informațiile utilizatorului
        loadUserInfo();
        
        console.log('Controller buton utilizator desktop inițializat cu succes');
    }
    
    /**
     * Încarcă informațiile utilizatorului din localStorage sau Firebase
     */
    function loadUserInfo() {
        try {
            // Încearcă să obțină utilizatorul din localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                updateUIForLoggedInUser(user);
            } else {
                updateUIForLoggedOutUser();
            }
        } catch (error) {
            console.error('Eroare la încărcarea informațiilor utilizatorului:', error);
            updateUIForLoggedOutUser();
        }
    }
    
    /**
     * Gestionează click-ul pe butonul de profil
     */
    function handleProfileButtonClick(event) {
        // Previne propagarea evenimentului
        event.stopPropagation();
        
        // Încearcă să obțină utilizatorul din localStorage
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Eroare la citirea utilizatorului din localStorage:', error);
        }
        
        // Închide meniul coșului dacă este deschis
        const cartDetails = document.querySelector('.cart-details');
        if (cartDetails) {
            cartDetails.style.display = 'none';
        }
        
        if (user) {
            // Utilizator autentificat - arată detaliile profilului
            toggleProfileMenu();
        } else {
            // Utilizator neautentificat - arată formularele de autentificare
            showAuthForm();
        }
    }
    
    /**
     * Comută vizibilitatea meniului de profil
     */
    function toggleProfileMenu() {
        const profileMenu = document.getElementById('profile-menu');
        const profileDetails = document.querySelector('.profile-details');
        
        // Încearcă mai întâi profile-menu (prioritar)
        if (profileMenu) {
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
            
            // Dacă există și profile-details, asigură-te că e vizibil
            if (profileDetails && profileMenu.style.display === 'block') {
                profileDetails.style.display = 'block';
            }
        } 
        // Dacă nu există profile-menu, încearcă profile-details
        else if (profileDetails) {
            profileDetails.style.display = profileDetails.style.display === 'block' ? 'none' : 'block';
        } else {
            console.warn('Nu s-a găsit nici meniul de profil, nici detaliile profilului!');
        }
    }
    
    /**
     * Afișează formularul de autentificare
     */
    function showAuthForm() {
        // Încearcă să găsească containerele de autentificare
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        
        if (loginContainer) {
            // Ascunde orice meniu de profil care ar putea fi deschis
            const profileDetails = document.querySelector('.profile-details');
            if (profileDetails) {
                profileDetails.style.display = 'none';
            }
            
            // Afișează formularul de login
            loginContainer.classList.add('active');
            if (registerContainer) {
                registerContainer.classList.remove('active');
            }
        } else {
            // Dacă nu există formulare de autentificare, redirecționează la pagina de login
            console.warn('Nu s-au găsit formulare de autentificare, redirecționez la pagina de login');
            window.location.href = 'login.html';
        }
    }
    
    /**
     * Actualizează UI-ul pentru un utilizator autentificat
     */
    function updateUIForLoggedInUser(user) {
        // Actualizează email-ul afișat
        const profileEmailElements = document.querySelectorAll('#profile-email');
        profileEmailElements.forEach(el => {
            if (el) el.innerText = user.email || '';
        });
        
        // Afișează meniul de profil și ascunde opțiunile de autentificare
        const profileMenuElements = document.querySelectorAll('#profile-menu');
        profileMenuElements.forEach(el => {
            if (el) el.style.display = 'block';
        });
        
        const authOptionsElements = document.querySelectorAll('.auth-options');
        authOptionsElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        const authButtonsElements = document.querySelectorAll('.auth-buttons');
        authButtonsElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
    
    /**
     * Actualizează UI-ul pentru un utilizator neautentificat
     */
    function updateUIForLoggedOutUser() {
        // Ascunde meniul de profil și afișează opțiunile de autentificare
        const profileMenuElements = document.querySelectorAll('#profile-menu');
        profileMenuElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        const authOptionsElements = document.querySelectorAll('.auth-options');
        authOptionsElements.forEach(el => {
            if (el) el.style.display = 'flex';
        });
        
        const authButtonsElements = document.querySelectorAll('.auth-buttons');
        authButtonsElements.forEach(el => {
            if (el) el.style.display = 'flex';
        });
    }
    
    /**
     * Realizează autentificarea cu email și parolă
     */
    function login(email, password) {
        // Verifică datele din localStorage
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (storedUser.email === email && storedUser.password === password) {
                // Autentificare reușită
                updateUIForLoggedInUser(storedUser);
                
                // Ascunde formularul de login
                const loginContainer = document.getElementById('login-container');
                if (loginContainer) loginContainer.classList.remove('active');
                
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Eroare la autentificare:', error);
            return false;
        }
    }
    
    /**
     * Înregistrează un utilizator nou
     */
    function register(email, password, name) {
        try {
            // Creează și salvează utilizatorul
            const user = { email, password, name };
            localStorage.setItem('user', JSON.stringify(user));
            
            // Actualizează UI-ul
            updateUIForLoggedInUser(user);
            
            // Ascunde formularul de înregistrare
            const registerContainer = document.getElementById('register-container');
            if (registerContainer) registerContainer.classList.remove('active');
            
            return true;
        } catch (error) {
            console.error('Eroare la înregistrare:', error);
            return false;
        }
    }
    
    /**
     * Deconectează utilizatorul curent
     */
    function logout() {
        try {
            // Șterge datele utilizatorului
            localStorage.removeItem('user');
            
            // Actualizează UI-ul
            updateUIForLoggedOutUser();
            
            // Închide meniul de profil
            const profileMenu = document.getElementById('profile-menu');
            const profileDetails = document.querySelector('.profile-details');
            
            if (profileMenu) profileMenu.style.display = 'none';
            if (profileDetails) profileDetails.style.display = 'none';
            
            return true;
        } catch (error) {
            console.error('Eroare la deconectare:', error);
            return false;
        }
    }
    
    /**
     * Afișează informațiile contului utilizatorului
     */
    function showAccountInfo() {
        // Închide meniul de profil
        toggleProfileMenu();
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Trebuie să fii autentificat pentru a vedea informațiile contului.');
                showAuthForm();
                return;
            }
            
            // Creează și afișează un modal cu informațiile contului
            const modalHTML = `
                <div class="account-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.3);max-width:80%;max-height:80%;overflow-y:auto;z-index:10000;">
                    <h2 style="color:#6b4423;margin-bottom:15px;">Informații Cont</h2>
                    <div style="margin-bottom:15px;">
                        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                        <p><strong>Nume:</strong> ${user.name || 'N/A'}</p>
                        <p><strong>Telefon:</strong> ${user.phone || 'N/A'}</p>
                    </div>
                    
                    <h3 style="margin-top:20px;margin-bottom:10px;">Actualizare Informații</h3>
                    <form id="update-account-form">
                        <div style="margin-bottom:10px;">
                            <label for="update-name">Nume:</label>
                            <input type="text" id="update-name" value="${user.name || ''}" style="width:100%;padding:8px;margin-top:5px;">
                        </div>
                        <div style="margin-bottom:10px;">
                            <label for="update-phone">Telefon:</label>
                            <input type="tel" id="update-phone" value="${user.phone || ''}" style="width:100%;padding:8px;margin-top:5px;">
                        </div>
                        <button type="submit" style="background:#6b4423;color:white;border:none;padding:10px 15px;border-radius:5px;margin-top:10px;cursor:pointer;">Actualizează</button>
                    </form>
                    
                    <button id="close-account" style="background:#999;color:white;border:none;padding:10px 15px;border-radius:5px;margin-top:15px;cursor:pointer;">Închide</button>
                </div>
                <div id="account-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            `;
            
            // Adaugă modalul la body
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = modalHTML;
            document.body.appendChild(tempContainer.firstElementChild);
            document.body.appendChild(tempContainer.lastElementChild);
            
            // Adaugă handler-ul pentru formularul de actualizare
            document.getElementById('update-account-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Actualizează datele utilizatorului
                user.name = document.getElementById('update-name').value;
                user.phone = document.getElementById('update-phone').value;
                
                // Salvează în localStorage
                localStorage.setItem('user', JSON.stringify(user));
                
                // Actualizează UI-ul
                updateUIForLoggedInUser(user);
                
                alert('Informațiile contului au fost actualizate!');
                
                // Închide modalul
                document.querySelector('.account-modal').remove();
                document.getElementById('account-overlay').remove();
            });
            
            // Adaugă handler pentru butonul de închidere
            document.getElementById('close-account').addEventListener('click', function() {
                document.querySelector('.account-modal').remove();
                document.getElementById('account-overlay').remove();
            });
            
            document.getElementById('account-overlay').addEventListener('click', function() {
                document.querySelector('.account-modal').remove();
                document.getElementById('account-overlay').remove();
            });
            
        } catch (error) {
            console.error('Eroare la afișarea informațiilor contului:', error);
            alert('A apărut o eroare la afișarea informațiilor contului.');
        }
    }
    
    /**
     * Afișează comenzile anterioare ale utilizatorului
     * Adaptat pentru a funcționa pe toate paginile site-ului
     */
    function showOrders() {
        // Închide meniul de profil
        toggleProfileMenu();
        
        try {
            // Verifică dacă utilizatorul este autentificat
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Trebuie să fii autentificat pentru a vedea comenzile anterioare.');
                showAuthForm();
                return;
            }
            
            // Obține comenzile din localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            
            if (orders.length === 0) {
                alert('Nu ai nicio comandă anterioară.');
                return;
            }
            
            // Creează și afișează un modal cu comenzile
            let ordersHTML = `
                <div class="orders-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.3);max-width:80%;max-height:80%;overflow-y:auto;z-index:10000;">
                    <h2 style="color:#6b4423;margin-bottom:15px;">Comenzile Tale</h2>
            `;
            
            orders.forEach((order, index) => {
                const date = new Date(order.date).toLocaleDateString('ro-RO');
                ordersHTML += `
                    <div style="border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:5px;">
                        <h3>Comanda #${index + 1} - ${date}</h3>
                        <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'} RON</p>
                        <p><strong>Status:</strong> ${order.status || 'Procesare'}</p>
                        <p><strong>Pagină:</strong> ${order.page || 'Produse'}</p>
                        <ul style="list-style:none;padding:0;">
                `;
                
                if (order.items && order.items.length > 0) {
                    order.items.forEach(item => {
                        ordersHTML += `
                            <li style="padding:5px 0;border-bottom:1px solid #eee;">
                                ${item.name} x${item.quantity} - ${item.price}
                            </li>
                        `;
                    });
                } else {
                    ordersHTML += `<li style="padding:5px 0;">Nu există detalii disponibile pentru această comandă.</li>`;
                }
                
                ordersHTML += `</ul></div>`;
            });
            
            ordersHTML += `
                <button id="close-orders" style="background:#6b4423;color:white;border:none;padding:10px 15px;border-radius:5px;margin-top:15px;cursor:pointer;">Închide</button>
                </div>
                <div id="orders-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            `;
            
            // Adaugă modalul la body
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = ordersHTML;
            document.body.appendChild(tempContainer.firstElementChild);
            document.body.appendChild(tempContainer.lastElementChild);
            
            // Adaugă handler pentru butonul de închidere
            document.getElementById('close-orders').addEventListener('click', function() {
                document.querySelector('.orders-modal').remove();
                document.getElementById('orders-overlay').remove();
            });
            
            document.getElementById('orders-overlay').addEventListener('click', function() {
                document.querySelector('.orders-modal').remove();
                document.getElementById('orders-overlay').remove();
            });
            
        } catch (error) {
            console.error('Eroare la afișarea comenzilor:', error);
            alert('A apărut o eroare la afișarea comenzilor.');
        }
    }
    
    /**
     * Afișează coșul de cumpărături
     * Compatibil cu toate paginile site-ului
     */
    function showCart() {
        // Închide meniul de profil
        toggleProfileMenu();
        
        // Obține informațiile despre pagina curentă
        const currentPage = getCurrentPage();
        
        // Găsește coșul și detaliile coșului specific pentru pagina curentă
        const cartDetails = document.querySelector('.cart-details');
        
        // Logică specifică pentru fiecare pagină
        if (currentPage === 'products') {
            // Cod specific pentru pagina de produse
        } else if (currentPage === 'home') {
            // Cod specific pentru pagina principală
        }
        
        // Restul codului pentru afișarea coșului...
    }
    
    /**
     * Determină pagina curentă
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('products')) return 'products';
        if (path.includes('ong')) return 'ong';
        if (path.includes('therapy')) return 'therapy';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }
    
    // Înregistrează controllerul ca manager exclusiv pentru butonul de profil DESKTOP
    window.PROFILE_BUTTON_MANAGED_BY_DESKTOP = 'utilizator-button-function-desktop.js';
    
    // Expune funcțiile pentru a fi apelate din alte părți ale aplicației
    window.DesktopUserButton = {
        initialize: initialize,
        login: login,
        register: register,
        logout: logout,
        showAccountInfo: showAccountInfo,
        showOrders: showOrders,
        showCart: showCart,
        toggleProfileMenu: toggleProfileMenu,
        handleProfileButtonClick: handleProfileButtonClick,
        deviceType: 'desktop' // Identificator explicit pentru tipul dispozitivului
    };
    
    // Inițializează butonul de profil când DOM-ul e gata
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM-ul e deja încărcat
        initialize();
    }
    
    // Verifică și inițializează din nou după încărcarea completă a paginii
    window.addEventListener('load', function() {
        // Verifică încă o dată că suntem pe desktop
        if (window.innerWidth > 768) {
            initialize();
        }
    });
    
    // Adaugă un listener pentru redimensionarea ferestrei pentru tranzițiile desktop-mobil
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const isDesktop = !isMobile;
        
        // Dacă am trecut la desktop și butonul nu e inițializat, inițializează-l
        if (isDesktop && !window.DESKTOP_USER_BUTTON_INITIALIZED) {
            console.log('Tranziție la desktop detectată, inițializarea butonului de profil desktop');
            window.DESKTOP_USER_BUTTON_INITIALIZED = true;
            initialize();
        }
        
        // Dacă am trecut la mobil, oprește funcționalitatea desktop
        if (isMobile && window.DESKTOP_USER_BUTTON_INITIALIZED) {
            console.log('Tranziție la mobil detectată, dezactivare buton profil desktop');
            window.DESKTOP_USER_BUTTON_INITIALIZED = false;
        }
    });
})();
