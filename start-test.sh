#!/bin/bash
echo "Starte Tests..."

./reset-db.sh

# open new terminal windows for the tests
gnome-terminal -- bash -c "cd frontend && echo 'Frontend wird gestartet...' && ng test; exec bash"

gnome-terminal -- bash -c "cd backend && echo 'Backend wird gestartet...' && npm run test; exec bash"

echo "Tests gestartet."