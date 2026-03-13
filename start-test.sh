#!/bin/bash
echo "Starte Tests..."

gnome-terminal -- bash -c "cd frontend && echo 'Frontend wird gestartet...' && ng test; exec bash"

gnome-terminal -- bash -c "cd backend && echo 'Backend wird gestartet...' && npm run test; exec bash"

echo "Tests gestartet."
