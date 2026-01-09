#!/bin/bash
echo "Starte Backend und Frontend..."

# Frontend starten
gnome-terminal -- bash -c "cd frontend && echo 'Frontend wird gestartet...' && ng serve; exec bash"

# Backend starten
gnome-terminal -- bash -c "cd backend && echo 'Backend wird gestartet...' && npx ts-node src/server.ts; exec bash"

echo "Beide Prozesse gestartet."
