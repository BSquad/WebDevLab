@echo off
echo Starte Backend und Frontend...

:: Frontend starten
start cmd /k "cd frontend && ng serve"

:: Backend starten
start cmd /k "cd backend && npm run start:dev"

echo Beide Prozesse gestartet.
