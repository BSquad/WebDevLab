#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

npm run reset-db

cd backend && npm run start:dev &
cd ..

cd frontend && npm start &
cd ..

cd frontend && npm run cy:open