@echo off
echo === RESTARTARE SERVER DE DEZVOLTARE ===

echo Oprirea proceselor node existente...
taskkill /f /im node.exe 2>nul

echo Pornirea serverului de dezvoltare cu port 3000...
npm run dev -- --port=3000 --strictPort --force
