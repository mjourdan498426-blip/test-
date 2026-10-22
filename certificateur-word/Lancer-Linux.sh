#!/usr/bin/env bash
# Lanceur Linux : double-cliquez (ou clic droit > « Exécuter comme un programme »).
cd "$(dirname "$0")" || exit 1

erreur() {
  if command -v zenity >/dev/null 2>&1; then zenity --error --width=420 --text="$1"
  else echo "$1"; read -r -p "Appuyez sur Entrée pour fermer..."; fi
  exit 1
}

command -v python3 >/dev/null 2>&1 || erreur "Python 3 n'est pas installé.
Installez-le avec la logithèque de votre système (paquet « python3 »)."
python3 -c "import tkinter" 2>/dev/null || erreur "Il manque le module graphique de Python.
Installez le paquet « python3-tk » avec la logithèque, puis relancez."

if [ ! -f .venv/.installe ]; then
  echo "Premier lancement : installation des composants (une minute environ)..."
  rm -rf .venv
  python3 -m venv .venv || erreur "Impossible de préparer l'application.
Installez le paquet « python3-venv » avec la logithèque, puis relancez."
  .venv/bin/python -m pip install --quiet --upgrade pip
  .venv/bin/python -m pip install --quiet -r requirements.txt || erreur "L'installation des composants a échoué.
Vérifiez votre connexion Internet, puis relancez."
  .venv/bin/python -m pip install --quiet tkinterdnd2 || true   # glisser-déposer (facultatif)
  touch .venv/.installe
fi

exec .venv/bin/python certificateur.py "$@"
