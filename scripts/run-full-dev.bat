@echo off
echo === FULL DEVELOPMENT ENVIRONMENT STARTUP ===
echo.
echo Step 1: Ensuring image variants exist...
call npm run ensure-images
echo.
echo Step 2: Repairing any corrupted images...
call npm run repair-images
echo.
echo Step 3: Starting development server...
call npm run dev
echo.
pause
