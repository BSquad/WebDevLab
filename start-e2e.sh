#!/bin/bash

echo "=== Resetting database ==="
npm run reset-db

echo "=== Starting backend ==="
cd backend && npm run start:dev &
cd ..

echo "=== Starting frontend ==="
cd frontend && npm start &
cd ..

echo "__________________________________________"
echo "Wait until Backend and Frontend are started"
echo "__________________________________________"
read -p "Press ENTER to continue..."

echo "=== Opening Cypress UI ==="
cd frontend && npm run cy:open