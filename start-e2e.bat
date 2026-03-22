@echo off


call reset-db.bat


start cmd /k "cd backend && npm run start:dev"


start cmd /k "cd frontend && npm start"


start cmd /k "cd frontend && npm run cy:open"