#!/bin/bash

cd "$(dirname "$0")"

echo "Starting backend and frontend..."

gnome-terminal -- bash -c "cd frontend && echo 'Starting frontend...' && ng serve; exec bash"

gnome-terminal -- bash -c "cd backend && echo 'Starting backend...' && npm run start:dev; exec bash"

echo "Backend and frontend started."