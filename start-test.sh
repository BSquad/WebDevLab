#!/bin/bash
echo "Starte Tests..."

gnome-terminal -- bash -c "cd frontend && echo 'Frontend wird gestartet...' && ng test; exec bash"

echo "Tests gestartet."
