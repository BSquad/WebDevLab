@echo off
echo Starte Backend und Frontend...

:: Frontend starten
start cmd /k "cd frontend && ng serve"

:: Backend starten
start cmd /k "cd backend && npm run dev"

echo Beide Prozesse gestartet.
