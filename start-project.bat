@echo off
call reset-db.bat



start cmd /k "cd frontend && ng serve"
start cmd /k "cd backend && npm run start:dev"

