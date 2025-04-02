@echo off
echo ===== REINSTALARE PROIECT VITE =====
echo.

echo Terminarea proceselor Node...
taskkill /f /im node.exe 2>nul

echo.
echo Ștergerea directoarelor temporare și cache...
if exist node_modules (
  echo Ștergere node_modules...
  rmdir /s /q node_modules
)

if exist package-lock.json (
  echo Ștergere package-lock.json...
  del /f package-lock.json
)

if exist dist (
  echo Ștergere dist...
  rmdir /s /q dist
)

echo.
echo Curățarea cache npm...
call npm cache clean --force

echo.
echo Instalarea dependențelor...
call npm install

echo.
echo Instalarea explicită a pachetelor Vite...
call npm install -D vite@latest @vitejs/plugin-react react-refresh rimraf

echo.
echo Crearea build...
call npm run build

echo.
echo Reinstalare completă! Acum încearcă să rulezi:
echo npm run dev
echo.
