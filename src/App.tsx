import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/index';
import Produse from './pages/Produse/produse';
import Ong from './pages/Ong/ong';
import Terapie from './pages/Terapie/terapie';
import Contact from './pages/Contact/contact';

function App() {
  return (
    <div className="App">
      <header>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Acasă</Link></li>
            <li><Link to="/produse">Produse</Link></li>
            <li><Link to="/ong">Făuritorii de Destin</Link></li>
            <li><Link to="/terapie">Terapie Personalizată</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produse" element={<Produse />} />
          <Route path="/ong" element={<Ong />} />
          <Route path="/terapie" element={<Terapie />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
