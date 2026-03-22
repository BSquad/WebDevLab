#!/bin/bash
echo "Starting tests..."

./reset-db.sh

gnome-terminal -- bash -c "cd frontend && ng test --code-coverage; exec bash"

gnome-terminal -- bash -c "cd backend && npm run test -- --coverage --coverageReporters=text-summary; exec bash"

echo "Tests started."