@echo off
cd /d "%~dp0"
echo Installing/checking GlassMart dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo Could not install dependencies. Check Python and internet connection.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:5000"
python app.py
pause
