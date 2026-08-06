@echo off
chcp 65001 > nul
echo ========================================================
echo   MQnet StudyCafe & SelfStudy Joint Production Launcher
echo ========================================================
echo.
echo Starting StudyCafe (http://localhost:8001) and SelfStudy (http://localhost:8005)...
cd /d "%~dp0"

docker compose up -d --build
echo.
echo Container Status:
docker compose ps
echo.
pause
