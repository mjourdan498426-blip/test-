# Certificateur de documents Word

Transforme un document Word en **PDF certifié** (avec un QR code), puis permet
de vérifier plus tard qu'un PDF n'a pas été modifié.

## Avant la première utilisation

Installez (une seule fois, gratuitement) :

1. **Python** : https://www.python.org/downloads/ (bouton jaune « Download Python »).
   Sur Windows, cochez **« Add python.exe to PATH »** pendant l'installation.
2. **LibreOffice** : https://fr.libreoffice.org/download/telecharger-libreoffice/

## Lancer l'application

Double-cliquez sur le lanceur de votre ordinateur :

- **Windows** : `Lancer-Windows.bat`
- **Mac** : `Lancer-Mac.command` (la première fois : clic droit › **Ouvrir** › **Ouvrir**)
- **Linux** : `Lancer-Linux.sh` (si besoin : clic droit › « Exécuter comme un programme »)

Le tout premier lancement prend environ une minute (installation automatique).
Ensuite, la fenêtre s'ouvre en quelques secondes.

## Certifier un document Word

Glissez votre fichier `.docx` dans la zone **« Certifier un Word »**
(ou cliquez sur **« Choisir un fichier »**).

Le PDF certifié est créé dans un dossier **`Certifies`**, à côté de votre fichier
Word. Votre fichier Word, lui, n'est jamais modifié.

## Vérifier un PDF

Glissez le PDF dans la zone **« Vérifier un PDF »**. La réponse s'affiche :

- ✅ **Document authentique et non modifié** (avec le nom et la date de certification)
- ❌ **Document modifié ou inconnu**

## À savoir

- Le fichier **`registre.json`** (à côté de l'application) garde la liste de vos
  certifications. **Ne le supprimez pas et sauvegardez-le régulièrement** : sans
  lui, aucun PDF ne peut plus être vérifié.
- Sur Windows, vous pouvez aussi glisser un fichier directement sur
  `Lancer-Windows.bat` : un Word est certifié, un PDF est vérifié.
