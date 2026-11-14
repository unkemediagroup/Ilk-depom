#!/bin/bash
# Incompetech (Kevin MacLeod, CC BY 4.0) arka plan müzikleri -> assets/music
cd "$(dirname "$0")/../assets/music" || exit 1
for t in "Galactic Rap" "Ethernight Club" "Night in Venice" "Cool Vibes" "Hitman" "Investigations" "Brain Dance" "Inspired" "Local Forecast - Elevator" "Sneaky Snitch" "Movement Proposition" "Funk Game Loop"; do
  [ -f "$t.mp3" ] || curl -s -m 60 -o "$t.mp3" "https://incompetech.com/music/royalty-free/mp3-royaltyfree/${t// /%20}.mp3"
done
