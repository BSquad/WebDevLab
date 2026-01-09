@echo off
echo Starte Backend und Frontend...

:: Frontend starten
start cmd /k "cd frontend && echo Frontend wird gestartet... && ng serve"

:: Backend starten
start cmd /k "cd backend && echo Backend wird gestartet... && npx ts-node src/server.ts"

echo Beide Prozesse gestartet.
pause
