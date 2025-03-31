import './produse.css';

const Produse = () => {
  const products = [
    {
      id: 1,
      name: 'Ulei esențial de lavandă',
      price: '65 RON',
      description: 'Ulei 100% natural de lavandă, perfect pentru aromaterapie și relaxare.',
      image: '/my-website/images/product1.jpg'
    },
    {
      id: 2,
      name: 'Set lumânări naturale',
      price: '120 RON',
      description: 'Set de 3 lumânări din ceară de soia cu uleiuri esențiale pentru o atmosferă relaxantă.',
      image: '/my-website/images/product2.jpg'
    },
    {
      id: 3,
      name: 'Ceai de plante medicinale',
      price: '40 RON',
      description: 'Amestec special de plante medicinale care ajută la relaxare și un somn odihnitor.',
      image: '/my-website/images/product3.jpg'
    }
  ];

  return (
    <div className="products-container">
      <div className="content-card">
        <h1>Produsele Noastre</h1>
        <p>
          Descoperă gama noastră de produse naturale, create cu ingrediente de cea mai bună calitate. 
          Toate produsele noastre sunt fabricate cu grijă și atenție pentru detalii, pentru a vă oferi 
          o experiență autentică și benefică.
        </p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} onError={(e) => {
                // Fallback to a placeholder if image doesn't load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/my-website/images/placeholder.jpeg';
              }} />
            </div>
            <div className="product-details">
              <h2>{product.name}</h2>
              <p className="product-price">{product.price}</p>
              <p className="product-description">{product.description}</p>
              <button className="btn add-to-cart">Adaugă în coș</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produse;
