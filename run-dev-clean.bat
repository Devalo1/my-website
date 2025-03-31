@echo off
echo === CLEAN START DEVELOPMENT SERVER ===
echo.
echo Step 1: Freeing all ports...
call npm run free-all-ports
echo.
echo Step 2: Creating placeholders for missing images...
call npm run create-placeholders
echo.
echo Step 3: Starting development server...
call npm run dev
echo.
pause
