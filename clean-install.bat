@echo off
echo Terminarea proceselor Node...
taskkill /f /im node.exe

echo Curățarea node_modules...
if exist node_modules (
  rmdir /s /q node_modules
)

echo Curățarea package-lock.json...
if exist package-lock.json (
  del package-lock.json
)

echo Curățarea cache-ului npm...
call npm cache clean --force

echo Instalarea dependențelor...
call npm install

echo Instalarea Vite...
call npm install -D vite@latest @vitejs/plugin-react

echo Pregatire fisiere necesare...
if not exist src\index.tsx (
  mkdir src 2>nul
  echo import React from 'react';>src\index.tsx
  echo import ReactDOM from 'react-dom/client';>>src\index.tsx
  echo import App from './App';>>src\index.tsx
  echo import './styles/index.css';>>src\index.tsx
  echo. >>src\index.tsx
  echo const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);>>src\index.tsx
  echo root.render(^<React.StrictMode^>^<App /^>^</React.StrictMode^>);>>src\index.tsx
)

if not exist src\App.tsx (
  echo import React from 'react';>src\App.tsx
  echo. >>src\App.tsx
  echo function App() {>>src\App.tsx
  echo   return (>>src\App.tsx
  echo     ^<div^>Hello World^</div^>>>src\App.tsx
  echo   );>>src\App.tsx
  echo }>>src\App.tsx
  echo. >>src\App.tsx
  echo export default App;>>src\App.tsx
)

if not exist src\styles (
  mkdir src\styles 2>nul
)

if not exist src\styles\index.css (
  echo body { margin: 0; padding: 0; }> src\styles\index.css
)

echo Încercând build...
call npm run build

echo Terminat.
