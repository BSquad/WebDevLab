#!/bin/bash

npm run reset-db

cd backend && npm run start:dev &
cd ..

cd frontend && npm start &
cd ..

cd frontend && npm run cy:open