@echo off

echo === Resetting database ===
call backend\reset-db.bat

echo === Starting backend ===
start cmd /k "cd backend && npm run start:dev"

echo === Starting frontend ===
start cmd /k "cd frontend && npm start"

echo.
echo __________________________________________
echo "Backend and Frontend are starting..."
echo "Wait until both are ready."
echo "Press ENTER to open Cypress."
echo __________________________________________
pause

echo === Opening Cypress UI ===
start cmd /k "cd frontend && npm run cy:open"