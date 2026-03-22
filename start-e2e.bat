@echo off

echo === Resetting database ===
call reset-db.bat

echo === Starting backend ===
start cmd /k "cd backend && npm run start:dev"

echo === Starting frontend ===
start cmd /k "cd frontend && npm start"

echo.
echo __________________________________________
echo Wait until Backend and Frontend are started
echo __________________________________________
echo Press ENTER to continue...
pause

echo === Opening Cypress UI ===
start cmd /k "cd frontend && npm run cy:open"