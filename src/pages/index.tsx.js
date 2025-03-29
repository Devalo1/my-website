import React from 'react';
import Header from '../components/Header';
import Cover from '../components/Cover';
import '../styles/global.css';

const IndexPage: React.FC = () => {
  return (
    <div className="app">
      <Cover />
      
      {/* Rest of your page content */}
      <main>
        <h2>Main Content</h2>
        <p>Welcome to my website!</p>
      </main>
    </div>
  );
};

export default IndexPage;
