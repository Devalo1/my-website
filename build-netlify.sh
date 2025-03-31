#!/bin/bash
set -e

echo "🚀 Starting static build for Netlify..."

# Create static build directory
mkdir -p static-build
mkdir -p static-build/images

# Create placeholder images
cat > static-build/images/placeholder.svg << 'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
  <rect width="100%" height="100%" fill="#fff8f0" rx="10" ry="10"/>
  <text x="50%" y="60%" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#6b4423">Lupul si Corbul</text>
</svg>
EOL

# Create index.html
cat > static-build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupul și Corbul</title>
</head>
<body>
  <h1>Site-ul este în construcție</h1>
</body>
</html>
EOL

echo "✅ Static build completed!"
