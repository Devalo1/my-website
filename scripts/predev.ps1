Write-Host "🚀 Running pre-development setup..." -ForegroundColor Cyan

# Step 1: Run ensure-images script
Write-Host "`n🔍 Running ensure-images script..." -ForegroundColor Yellow
npm run ensure-images

# Step 2: Run repair-images script
Write-Host "`n🔧 Running repair-images script..." -ForegroundColor Yellow
npm run repair-images

Write-Host "`n✅ Pre-development setup completed successfully!" -ForegroundColor Green
