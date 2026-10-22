#!/bin/bash
# Lanceur Mac : double-cliquez sur ce fichier.
cd "$(dirname "$0")" || exit 1

erreur() {
  osascript -e "display alert \"Certificateur\" message \"$1\" as critical" >/dev/null 2>&1 || echo "$1"
  exit 1
}

PY=""
for c in /Library/Frameworks/Python.framework/Versions/Current/bin/python3 python3; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c "import tkinter" 2>/dev/null; then PY="$c"; break; fi
done
[ -n "$PY" ] || erreur "Python 3 n'est pas installé (ou incomplet).

Téléchargez-le sur https://www.python.org/downloads/ (bouton jaune « Download Python »), installez-le, puis relancez."

if [ ! -f .venv/.installe ]; then
  echo "Premier lancement : installation des composants (une minute environ)..."
  rm -rf .venv
  "$PY" -m venv .venv || erreur "Impossible de préparer l'application."
  .venv/bin/python -m pip install --quiet --upgrade pip
  .venv/bin/python -m pip install --quiet -r requirements.txt || erreur "L'installation des composants a échoué. Vérifiez votre connexion Internet, puis relancez."
  .venv/bin/python -m pip install --quiet tkinterdnd2 || true   # glisser-déposer (facultatif)
  touch .venv/.installe
fi

.venv/bin/python certificateur.py "$@" &
disown
# Ferme la fenêtre du Terminal ouverte par le double-clic.
osascript -e 'tell application "Terminal" to close (every window whose name contains "Lancer-Mac")' >/dev/null 2>&1 &
exit 0
