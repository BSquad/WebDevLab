#!/bin/bash
echo "Starting tests..."

./reset-db.sh


gnome-terminal -- bash -c "cd frontend && ng test --watch=true --code-coverage; exec bash"


gnome-terminal -- bash -c "cd backend && npm run test -- --coverage --coverageReporters=text-summary --coverageReporters=lcov; exec bash"

echo "Tests started."