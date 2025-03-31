#!/bin/bash
set -e

echo "🚀 Starting pure static build for Netlify..."

# Create static build directory
mkdir -p static-build
mkdir -p static-build/images
mkdir -p static-build/css
mkdir -p static-build/js

# Create index.html
cat > static-build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div class="card">
    <img src="images/logo.svg" alt="Lupul și Corbul Logo" class="logo">
    <h1>Lupul și Corbul</h1>
    <div class="message">
      <p>Site-ul nostru este în construcție și va fi disponibil în curând.</p>
      <p>Vă mulțumim pentru răbdare!</p>
    </div>
    <a class="link" href="https://github.com/Devalo1/my-website">Vezi proiectul pe GitHub</a>
  </div>
</body>
</html>
EOL

# Create CSS
cat > static-build/css/main.css << 'EOL'
body { 
  font-family: 'Roboto', Arial, sans-serif; 
  background-color: #fff8f0; 
  text-align: center; 
  padding: 50px; 
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}
h1 { color: #6b4423; }
.message { margin: 20px 0; }
.link {
  display: inline-block;
  margin-top: 20px;
  background-color: #8b5a2b;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.link:hover {
  background-color: #6b4423;
}
.logo {
  max-width: 200px;
  margin-bottom: 20px;
}
EOL

# Create basic SVG logo
cat > static-build/images/logo.svg << 'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <rect width="300" height="100" fill="#fff8f0" rx="10" ry="10"/>
  <text x="150" y="60" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
</svg>
EOL

# Create a _redirects file for SPA routing
echo "/* /index.html 200" > static-build/_redirects

echo "✅ Static site build completed without using npm or Node.js!"
