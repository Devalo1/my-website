@echo off
echo ===================================================
echo        Deploying website to GitHub Pages
echo ===================================================

echo.
echo [1/4] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please fix the errors and try again.
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Adding dist folder to git...
git add dist -f
if %ERRORLEVEL% NEQ 0 (
    echo Failed to add dist folder to git. Aborting.
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Committing changes...
git commit -m "Actualizare site pentru GitHub Pages"
if %ERRORLEVEL% NEQ 0 (
    echo Failed to commit changes. Aborting.
    exit /b %ERRORLEVEL%
)

echo.
echo [4/4] Pushing to gh-pages branch...
git subtree push --prefix dist origin gh-pages
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to push to gh-pages. If this is your first deployment, try:
    echo git push origin --delete gh-pages
    echo Then run this script again.
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo Deployment successful! 
echo Your site should be live in a few minutes at:
echo https://[your-username].github.io/my-website
echo ===================================================
echo.
echo Note: If this is your first deployment, you may need to
echo enable GitHub Pages in your repository settings:
echo 1. Go to repository Settings
echo 2. Navigate to Pages section
echo 3. Select "gh-pages" branch as the source
echo 4. Save changes
echo.
echo Press any key to exit...
pause > nul
