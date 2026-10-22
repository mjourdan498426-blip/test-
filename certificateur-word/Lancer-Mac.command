#!/bin/bash
# Lanceur Mac : double-cliquez sur ce fichier.
cd "$(dirname "$0")" || exit 1

erreur() {
  osascript -e "display alert \"Certificateur\" message \"$1\" as critical" >/dev/null 2>&1 || echo "$1"
  exit 1
}

# Python installé depuis python.org (ou Homebrew). Le python3 fourni par macOS
# est volontairement ignoré : il ouvre une fenêtre d'installation des outils
# Apple et son affichage graphique est obsolète.
PY=""
for c in /Library/Frameworks/Python.framework/Versions/Current/bin/python3 \
         /Library/Frameworks/Python.framework/Versions/3.*/bin/python3 \
         /usr/local/bin/python3 /opt/homebrew/bin/python3; do
  if [ -x "$c" ] && "$c" -c "import tkinter; tkinter.Tcl()" >/dev/null 2>&1; then PY="$c"; break; fi
done
[ -n "$PY" ] || erreur "Python n'est pas installé sur ce Mac.

1. Ouvrez https://www.python.org/downloads/
2. Cliquez sur le bouton jaune « Download Python » et installez-le.
3. Relancez le Certificateur."

if [ ! -f .venv/.installe ]; then
  osascript -e 'display notification "Installation des composants, une minute environ…" with title "Certificateur – premier lancement"' >/dev/null 2>&1
  echo "Premier lancement : installation des composants (une minute environ)..."
  rm -rf .venv
  "$PY" -m venv .venv || erreur "Impossible de préparer l'application."
  .venv/bin/python -m pip install --quiet --upgrade pip
  .venv/bin/python -m pip install --quiet -r requirements.txt || erreur "L'installation des composants a échoué. Vérifiez votre connexion Internet, puis relancez."
  .venv/bin/python -m pip install --quiet tkinterdnd2 || true   # glisser-déposer (facultatif)
  touch .venv/.installe
fi

# L'application est détachée du Terminal : fermer la fenêtre Terminal ne la ferme pas.
.venv/bin/python -c '
import subprocess, sys
journal = open("journal.txt", "a")
subprocess.Popen([sys.executable, "certificateur.py", *sys.argv[1:]], start_new_session=True,
                 stdin=subprocess.DEVNULL, stdout=journal, stderr=subprocess.STDOUT)
' "$@"

# Ferme la fenêtre Terminal ouverte par le double-clic.
osascript -e 'tell application "Terminal" to close (every window whose name contains "Lancer-Mac")' >/dev/null 2>&1 &
exit 0
