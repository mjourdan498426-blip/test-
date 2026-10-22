# Certificateur de documents Word (Mac)

Transforme un document Word en **PDF certifié** (avec un QR code), puis permet
de vérifier plus tard qu'un PDF n'a pas été modifié.

## Avant la première utilisation (une seule fois)

1. Installez **Python** : https://www.python.org/downloads/ (bouton jaune « Download Python »).
2. Installez **LibreOffice** : https://fr.libreoffice.org/download/telecharger-libreoffice/
   puis ouvrez-le **une fois** depuis le dossier Applications et refermez-le.
3. Placez le dossier **Certificateur** où vous voulez (par exemple sur le bureau).

## Lancer l'application

Double-cliquez sur **`Lancer-Mac.command`**.

**La toute première fois**, le Mac bloque le fichier parce qu'il vient d'Internet :
- cliquez sur **Terminé** (ou **OK**) ;
- ouvrez **Réglages Système › Confidentialité et sécurité**, descendez en bas et
  cliquez sur **« Ouvrir quand même »** à côté de « Lancer-Mac.command » ;
- confirmez avec votre mot de passe.

(Sur un Mac plus ancien : clic droit sur le fichier › **Ouvrir** › **Ouvrir**.)

Le premier lancement prend environ une minute (installation automatique).
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

Le fichier **`registre.json`** (dans le dossier Certificateur) garde la liste de
vos certifications. **Ne le supprimez pas et sauvegardez-le régulièrement** :
sans lui, aucun PDF ne peut plus être vérifié. Si vous déplacez le dossier
Certificateur, déplacez-le en entier.
