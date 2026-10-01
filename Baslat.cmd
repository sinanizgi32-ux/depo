@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js bulunamadı. Önce https://nodejs.org/ adresinden güncel LTS sürümünü kurun.
  echo Kurulumdan sonra bu dosyayı yeniden açın. Proje ücretsiz ve yerel olarak çalışır.
  pause
  exit /b 1
)
node scripts\serve.mjs --open
if errorlevel 1 pause
