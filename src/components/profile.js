import { auth, logout } from "./auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const profile = document.querySelector('.profile');
    const profileDetails = document.querySelector('.profile-details');

    profile.addEventListener('click', () => {
        profileDetails.style.display = profileDetails.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        logout();
    });

    updateUI();
});

function showLogin() {
    document.getElementById('login-container').classList.add('active');
    document.getElementById('register-container').classList.remove('active');
    document.querySelector('.profile-details').style.display = 'none';
}

window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.querySelector('.profile').style.display = 'block';
        document.getElementById('profile-email').innerText = user.email;
        document.getElementById('profile-menu').style.display = 'block';
        document.querySelector('.auth-options').style.display = 'none';
        document.querySelector('.auth-buttons').style.display = 'none';
    }
});

function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    localStorage.setItem('user', JSON.stringify({ email, password, name }));
    alert('Înregistrare reușită!');
    toggleAuthForms();
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === email && user.password === password) {
        alert('Autentificare reușită!');
        document.getElementById('login-container').classList.remove('active');
        profileEmail.innerText = user.email;
        profile.style.display = 'block';
    } else {
        alert('Email sau parolă incorectă!');
    }
}

function prefillForms(user) {
    document.querySelectorAll('input[name="email"]').forEach(input => input.value = user.email);
    document.querySelectorAll('input[name="phone"]').forEach(input => input.value = user.phone);
    // Add more fields as necessary
}
