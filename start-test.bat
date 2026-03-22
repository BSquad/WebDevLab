call reset-db.bat
start cmd /k "cd frontend && ng test"
start cmd /k "cd backend && npm run test -- --coverage --coverageReporters=text-summary --coverageReporters=lcov"