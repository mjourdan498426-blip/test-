# Certificateur en ligne (Google Drive)

Une page web, dans votre compte Google, où vous glissez un document Word :
elle vous rend aussitôt le **PDF certifié avec son QR code**, et range le Word
d'origine et le PDF dans votre **Google Drive** (dossier « Certificateur »).

Rien à payer, rien à héberger : la page appartient à votre compte Google et
vous seul y avez accès.

## Installation (une seule fois, environ 10 minutes)

Vous aurez besoin des 3 fichiers de ce dossier : `Code.gs`, `Index.html` et
`appsscript.json` (ouvrez-les avec TextEdit pour copier leur contenu).

1. Allez sur **https://script.google.com** (connecté à votre compte Google)
   et cliquez sur **« Nouveau projet »**.
2. En haut à gauche, cliquez sur « Projet sans titre » et renommez-le
   **Certificateur**.
3. À gauche, cliquez sur la **roue dentée** (Paramètres du projet) et cochez
   **« Afficher le fichier manifeste "appsscript.json" dans l'éditeur »**.
4. Revenez à l'éditeur (icône **< >** à gauche). Pour chaque fichier, effacez
   tout son contenu puis collez celui du fichier correspondant :
   - `appsscript.json` ← contenu de **appsscript.json**
   - `Code.gs` ← contenu de **Code.gs**
5. Cliquez sur le **+** à côté de « Fichiers », choisissez **HTML**, nommez-le
   **Index** (exactement, sans « .html »), effacez son contenu et collez celui
   de **Index.html**.
6. Cliquez sur l'icône **disquette** (Enregistrer).
7. En haut à droite : **Déployer › Nouveau déploiement**. Cliquez sur la roue
   dentée à côté de « Sélectionner le type » et choisissez **Application Web**.
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **Moi uniquement**

   Cliquez sur **Déployer**.
8. Google demande l'autorisation d'accéder à votre Drive : cliquez sur
   **Autoriser l'accès**, choisissez votre compte. Si un écran « Google n'a pas
   validé cette application » apparaît, c'est normal (c'est votre propre
   application) : cliquez sur **Paramètres avancés**, puis sur
   **Accéder à Certificateur**, puis **Autoriser**.
9. Copiez l'**URL de l'application Web** affichée, ouvrez-la et **ajoutez-la à
   vos favoris**. C'est votre Certificateur.

## Utilisation

- **Certifier** : glissez un `.docx` dans « Certifier un Word ». Après quelques
  secondes, cliquez sur **« Télécharger le PDF certifié »**. Le Word d'origine
  et le PDF sont aussi rangés dans votre Drive, dossier **Certificateur**.
- **Vérifier** : glissez un PDF dans « Vérifier un PDF ». Réponse :
  ✅ **Document authentique et non modifié** ou ❌ **Document modifié ou inconnu**.

Dans votre Drive, le dossier **Certificateur** contient :
- **Originaux Word** : vos fichiers Word, tels que vous les avez envoyés ;
- **Certifies** : les PDF certifiés ;
- **Registre des certifications** : la feuille qui sert à la vérification.
  **Ne la supprimez pas et ne modifiez pas ses colonnes.**

## Bon à savoir

- La mise en page du PDF passe par Google Docs : elle peut différer légèrement
  de celle de Word (polices, espacements). Contrôlez le premier PDF.
- Après une modification du code, il faut **Déployer › Gérer les déploiements ›
  crayon › Version : Nouvelle version › Déployer** pour que la page change.
