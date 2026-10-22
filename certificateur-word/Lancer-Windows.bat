@echo off
rem Lanceur Windows : double-cliquez, ou glissez un fichier sur ce lanceur.
chcp 65001 >nul
cd /d "%~dp0"

set "PY="
py -3 -c "import tkinter" >nul 2>&1 && set "PY=py -3"
if not defined PY python -c "import tkinter" >nul 2>&1 && set "PY=python"
if not defined PY (
  echo.
  echo  Python 3 n'est pas installe sur cet ordinateur.
  echo.
  echo  1. Ouvrez https://www.python.org/downloads/
  echo  2. Cliquez sur le bouton jaune "Download Python"
  echo  3. Pendant linstallation, cochez "Add python.exe to PATH"
  echo  4. Relancez ce fichier.
  echo.
  pause
  exit /b 1
)

if not exist ".venv\.installe" (
  echo Premier lancement : installation des composants, une minute environ...
  if exist ".venv" rmdir /s /q ".venv"
  %PY% -m venv .venv
  ".venv\Scripts\python.exe" -m pip install --quiet --upgrade pip
  ".venv\Scripts\python.exe" -m pip install --quiet -r requirements.txt
  if errorlevel 1 (
    echo.
    echo  L'installation a echoue. Verifiez votre connexion Internet puis relancez.
    pause
    exit /b 1
  )
  ".venv\Scripts\python.exe" -m pip install --quiet tkinterdnd2
  echo ok> ".venv\.installe"
)

start "" ".venv\Scripts\pythonw.exe" certificateur.py %*
