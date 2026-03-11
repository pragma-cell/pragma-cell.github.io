#!/usr/bin/env bash
# Usage: ./switch.sh [original|tabler]
# Copie le contenu du thème choisi dans assets/icons/ et assets/images/
# et met à jour index.html si nécessaire.

set -e

THEME="${1}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$SCRIPT_DIR/.."
INDEX="$ROOT/../index.html"

if [ -z "$THEME" ]; then
  echo "Usage: $0 [original|tabler]"
  echo ""
  echo "Thèmes disponibles :"
  for d in "$SCRIPT_DIR"/*/; do
    [ -d "$d" ] && echo "  - $(basename "$d")"
  done
  exit 1
fi

THEME_DIR="$SCRIPT_DIR/$THEME"

if [ ! -d "$THEME_DIR" ]; then
  echo "Erreur : thème '$THEME' introuvable dans $SCRIPT_DIR"
  exit 1
fi

echo "→ Activation du thème : $THEME"

if [ -d "$THEME_DIR/icons" ]; then
  cp "$THEME_DIR/icons/"* "$ROOT/icons/"
  echo "  ✓ icons/ mis à jour"
fi

if [ -d "$THEME_DIR/images" ]; then
  cp "$THEME_DIR/images/"* "$ROOT/images/"
  echo "  ✓ images/ mis à jour"
fi

# Mettre à jour l'extension de hero-illustration dans index.html selon le thème
if [ "$THEME" = "tabler" ]; then
  sed -i '' 's|hero-illustration\.svg|hero-illustration.png|g' "$INDEX"
  echo "  ✓ index.html : hero-illustration.svg → .png"
elif [ "$THEME" = "original" ]; then
  sed -i '' 's|hero-illustration\.png|hero-illustration.svg|g' "$INDEX"
  echo "  ✓ index.html : hero-illustration.png → .svg"
fi

echo "Thème '$THEME' activé."
