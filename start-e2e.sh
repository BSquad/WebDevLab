#!/bin/bash

echo "=== Resetting database ==="
cd backend && npm run reset-db && cd ..

echo "=== Starting backend ==="
cd backend && npm run start:dev &
cd ..

echo "=== Starting frontend ==="
cd frontend && npm start &
cd ..

echo ""
echo "__________________________________________"
echo "Backend and Frontend are starting..."
echo "Wait until both are ready."
echo "Press ENTER to open Cypress."
echo "__________________________________________"
read -p "Press ENTER to continue..."

echo "=== Opening Cypress UI ==="
cd frontend && npm run cy:open