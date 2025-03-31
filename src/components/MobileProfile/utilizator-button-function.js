(function() {
    // Check if DEBUG is defined globally, if not, set a default
    const DEBUG = typeof window.DEBUG !== 'undefined' ? window.DEBUG : false;
    
    function debug(message) {
        if (DEBUG) console.log("ProfileButton: " + message);
    }
    
    // Define the button functionality
    class ProfileButtonController {
        constructor() {
            this.isLoggedIn = false;
            this.userData = null;
            this.buttonElement = null;
            this.initialized = false;
            
            debug("Controller created");
        }
        
        init() {
            if (this.initialized) {
                debug("Already initialized");
                return;
            }
            
            // Find the profile button
            this.buttonElement = document.getElementById('profile-button-v7') || 
                                 document.querySelector('.profile-button') ||
                                 document.querySelector('[aria-label="Profil"]');
            
            if (!this.buttonElement) {
                debug("Profile button not found, will retry later");
                setTimeout(() => this.init(), 500);
                return;
            }
            
            debug("Profile button found, initializing events");
            
            // Add click event listener
            this.buttonElement.addEventListener('click', this.handleProfileClick.bind(this));
            
            // Check authentication status if Firebase is available
            this.checkAuthStatus();
            
            // Listen for auth state changes
            document.addEventListener('authStateChanged', this.handleAuthStateChange.bind(this));
            
            this.initialized = true;
            debug("Initialization complete");
            
            // Expose the controller on the window object for external access
            if (typeof window !== 'undefined') {
                window.ProfileButtonController = this;
            }
        }
        
        checkAuthStatus() {
            // Check if Firebase is available
            if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
                debug("Firebase found, checking auth status");
                
                window.firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        debug("User is logged in: " + user.email);
                        this.isLoggedIn = true;
                        this.userData = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        };
                        this.updateButtonAppearance();
                    } else {
                        debug("User is not logged in");
                        this.isLoggedIn = false;
                        this.userData = null;
                        this.updateButtonAppearance();
                    }
                });
            } else {
                debug("Firebase not found, assuming not logged in");
                this.isLoggedIn = false;
                this.userData = null;
                this.updateButtonAppearance();
            }
        }
        
        handleAuthStateChange(event) {
            const user = event.detail.user;
            debug("Auth state changed event received");
            
            if (user) {
                debug("User logged in via event: " + user.email);
                this.isLoggedIn = true;
                this.userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                };
            } else {
                debug("User logged out via event");
                this.isLoggedIn = false;
                this.userData = null;
            }
            
            this.updateButtonAppearance();
        }
        
        updateButtonAppearance() {
            if (!this.buttonElement) return;
            
            if (this.isLoggedIn && this.userData) {
                debug("Updating button for logged in user");
                
                // If user has a profile photo, use it
                if (this.userData.photoURL) {
                    this.buttonElement.innerHTML = `<img src="${this.userData.photoURL}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                } else {
                    // Otherwise, use initials or default icon
                    const initials = this.userData.displayName 
                                   ? this.userData.displayName.charAt(0).toUpperCase() 
                                   : this.userData.email.charAt(0).toUpperCase();
                    
                    this.buttonElement.innerHTML = `<span style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background-color:#6b4423; color:white; border-radius:50%; font-weight:bold;">${initials}</span>`;
                }
                
                // Add a logged-in indicator
                this.buttonElement.classList.add('logged-in');
            } else {
                debug("Updating button for guest user");
                
                // Default profile icon for not logged in
                this.buttonElement.innerHTML = '<i style="font-family: sans-serif;">👤</i>';
                this.buttonElement.classList.remove('logged-in');
            }
        }
        
        handleProfileClick(event) {
            debug("Profile button clicked");
            event.preventDefault();
            
            if (this.isLoggedIn) {
                debug("Showing profile menu for logged in user");
                this.showProfileMenu();
            } else {
                debug("Showing login dialog");
                this.showLoginDialog();
            }
        }
        
        showProfileMenu() {
            // Create and show profile menu
            const menuExists = document.getElementById('profile-dropdown-menu');
            
            if (menuExists) {
                debug("Menu already exists, toggling visibility");
                menuExists.classList.toggle('visible');
                return;
            }
            
            debug("Creating profile menu");
            
            const menu = document.createElement('div');
            menu.id = 'profile-dropdown-menu';
            menu.className = 'profile-dropdown-menu visible';
            menu.style.cssText = `
                position: absolute;
                top: 60px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 10px 0;
                z-index: 1000;
                min-width: 180px;
            `;
            
            // Add menu items
            menu.innerHTML = `
                <div style="padding: 10px 15px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: bold;">${this.userData.displayName || 'User'}</div>
                    <div style="font-size: 0.9em; color: #666;">${this.userData.email}</div>
                </div>
                <div class="menu-item" data-action="profile" style="padding: 10px 15px; cursor: pointer; hover-background: #f5f5f5;">Profilul meu</div>
                <div class="menu-item" data-action="orders" style="padding: 10px 15px; cursor: pointer; hover-background: #f5f5f5;">Comenzile mele</div>
                <div class="menu-item" data-action="logout" style="padding: 10px 15px; cursor: pointer; hover-background: #f5f5f5; color: #d9534f;">Deconectare</div>
            `;
            
            // Add event listeners to menu items
            menu.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                if (!action) return;
                
                debug("Menu action clicked: " + action);
                
                if (action === 'logout') {
                    this.logout();
                } else if (action === 'profile') {
                    window.location.href = '/my-website/profile';
                } else if (action === 'orders') {
                    window.location.href = '/my-website/orders';
                }
                
                menu.classList.remove('visible');
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && e.target !== this.buttonElement) {
                    menu.classList.remove('visible');
                }
            });
            
            document.body.appendChild(menu);
        }
        
        showLoginDialog() {
            debug("Login dialog would show here");
            // For now, just redirect to login page
            window.location.href = '/my-website/login';
        }
        
        logout() {
            debug("Logging out user");
            
            if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
                window.firebase.auth().signOut()
                    .then(() => {
                        debug("Logout successful");
                        // The auth state changed listener will update UI
                    })
                    .catch((error) => {
                        debug("Logout error: " + error.message);
                    });
            } else {
                debug("Firebase not available for logout");
            }
        }
    }
    
    // Initialize the controller
    const profileController = new ProfileButtonController();
    profileController.init();
    
    debug("Script inițiat");
})();
