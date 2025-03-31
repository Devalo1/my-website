import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const location = useLocation()
  const [pageClass, setPageClass] = useState('')
  
  useEffect(() => {
    // Determine page class based on route
    const path = location.pathname
    if (path === '/' || path === '') {
      setPageClass('home-page')
    } else if (path.includes('products')) {
      setPageClass('products-page')
    } else if (path.includes('ong')) {
      setPageClass('ong-page')
    } else if (path.includes('therapy')) {
      setPageClass('therapy-page')
    } else if (path.includes('contact')) {
      setPageClass('contact-page')
    } else {
      setPageClass('default-page')
    }
    
    // Set page class on body for global styling
    document.body.className = pageClass
    
    // Document title based on page
    const titles = {
      'home-page': 'Acasă | Lupul și Corbul',
      'products-page': 'Produse | Lupul și Corbul',
      'ong-page': 'Făuritorii de Destin | Lupul și Corbul',
      'therapy-page': 'Terapie Personalizată | Lupul și Corbul',
      'contact-page': 'Contact | Lupul și Corbul',
      'default-page': 'Lupul și Corbul'
    }
    document.title = titles[pageClass as keyof typeof titles] || titles['default-page']
    
    // Check for background image loading
    const checkBackgroundImage = () => {
      const body = document.body
      const computedStyle = window.getComputedStyle(body)
      const backgroundImage = computedStyle.backgroundImage
      
      if (!backgroundImage || backgroundImage === 'none' || backgroundImage.includes('undefined')) {
        console.log('Background image not loading properly, applying fallback')
        body.style.backgroundImage = 'url("/my-website/images/cover.jpeg")'
      }
    }
    
    // Check background after a short delay to ensure styles have applied
    setTimeout(checkBackgroundImage, 500)
    
  }, [location.pathname, pageClass])
  
  return (
    <div className={`app-container ${pageClass}`}>
      {/* Header will be injected by scripts */}
      <main className="page-container">
        <Outlet />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Lupul și Corbul. Toate drepturile rezervate.</p>
      </footer>
    </div>
  )
}

export default App
