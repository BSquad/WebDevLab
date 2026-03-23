#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

echo "Starting backend and frontend..."

gnome-terminal -- bash -c "cd frontend && echo 'Starting frontend...' && ng serve; exec bash"

gnome-terminal -- bash -c "cd backend && echo 'Starting backend...' && npm run start:dev; exec bash"

echo "Backend and frontend started."