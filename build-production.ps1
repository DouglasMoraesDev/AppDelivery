# Script de build para produção - Windows PowerShell
Write-Host "🚀 Iniciando build de produção..." -ForegroundColor Green

try {
    # 1. Build do frontend
    Write-Host "📦 Building frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Erro no build do frontend" }
    Set-Location ..

    # 2. Build do backend
    Write-Host "📦 Building backend..." -ForegroundColor Yellow
    Set-Location backend
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Erro no build do backend" }
    Set-Location ..

    # 3. Copiar frontend build para dentro do backend
    Write-Host "📁 Copiando frontend para backend..." -ForegroundColor Yellow
    $frontendDist = Join-Path $PWD "frontend\dist"
    $backendPublic = Join-Path $PWD "backend\public"
    
    if (Test-Path $backendPublic) {
        Remove-Item $backendPublic -Recurse -Force
    }
    
    Copy-Item $frontendDist $backendPublic -Recurse

    Write-Host "✅ Build concluído! Execute 'npm start' para rodar em produção." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erro durante o build: $_" -ForegroundColor Red
    exit 1
}