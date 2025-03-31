import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

/**
 * Login page component
 * Handles user login and registration functionality
 */
const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setSuccess('Sunteți deja autentificat. Redirectare...');
      setTimeout(() => navigate('/'), 1500); // Redirect to home page
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Login logic
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.email === email && storedUser.password === password) {
          setSuccess('Autentificare reușită! Redirectare...');
          localStorage.setItem('lastLogin', new Date().toISOString());
          setTimeout(() => navigate('/'), 1500); // Redirect to home page
        } else {
          setError('Email sau parolă invalidă');
        }
      } catch (err) {
        setError('Eroare la autentificare');
        console.error('Login error:', err);
      }
    } else {
      // Register logic
      if (!name) {
        setError('Numele este obligatoriu');
        return;
      }

      try {
        // Simple validation
        if (!email.includes('@') || password.length < 6) {
          setError('Email invalid sau parola prea scurtă (minim 6 caractere)');
          return;
        }

        const user = { email, password, name, createdAt: new Date().toISOString() };
        localStorage.setItem('user', JSON.stringify(user));
        setSuccess('Înregistrare reușită! Acum vă puteți autentifica.');
        // Reset form and switch to login mode
        setName('');
        setEmail('');
        setPassword('');
        setIsLogin(true);
      } catch (err) {
        setError('Eroare la înregistrare');
        console.error('Register error:', err);
      }
    }
  };

  const handleGoogleAuth = () => {
    // Handle Google authentication (placeholder)
    alert('Funcționalitatea de autentificare cu Google va fi implementată în curând!');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? 'Autentificare' : 'Înregistrare'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nume</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Introduceți numele complet"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Introduceți adresa de email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Introduceți parola"
              required
            />
          </div>
          
          <button type="submit" className="primary-button">
            {isLogin ? 'Autentificare' : 'Înregistrare'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>sau</span>
        </div>
        
        <button className="google-auth-button" onClick={handleGoogleAuth}>
          <img src="/my-website/images/google-icon.png" alt="Google" className="google-icon" />
          <span>Continuă cu Google</span>
        </button>
        
        <div className="auth-switch">
          {isLogin ? (
            <>
              Nu ai cont? <button onClick={() => setIsLogin(false)}>Înregistrează-te</button>
            </>
          ) : (
            <>
              Ai deja cont? <button onClick={() => setIsLogin(true)}>Autentifică-te</button>
            </>
          )}
        </div>
        
        <div className="back-to-home">
          <Link to="/">Înapoi la pagina principală</Link>
        </div>
      </div>
    </div>
  );
};

// Make sure to export the component as default
export default Login;
