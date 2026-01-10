@echo off
echo Starte Backend und Frontend...

:: Frontend starten
start cmd /k "cd frontend && ng serve"

:: Backend starten
start cmd /k "cd backend && npx ts-node src/server.ts"

echo Beide Prozesse gestartet.
