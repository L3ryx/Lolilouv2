# Déploiement sur Render

L'application est prête à être déployée sur [Render](https://render.com/).

## Instructions de configuration

1. Créez un compte sur Render.
2. Connectez votre dépôt GitHub contenant ce code.
3. Cliquez sur **New +** et choisissez **Web Service**.
4. Configurez le Web Service avec les paramètres suivants :
   - **Environment** : Node
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
5. Allez dans l'onglet **Environment** de votre Web Service Render.
6. Ajoutez les variables d'environnement suivantes :
   - `ZENSERP_API_KEY` : `098d2360-17a3-11f1-a0d3-e3811449dfc7` (ou votre nouvelle clé)
   - `DATABASE_URL` : l'URL de votre base de données PostgreSQL Render (si vous souhaitez logguer les requêtes).

## Remarque technique sur l'upload d'images
L'application sauvegarde temporairement les images uploadées dans le dossier `uploads/` de l'environnement serveur, afin d'exposer une URL publique à l'API Zenserp pour la recherche inversée. 
Sur Render, le système de fichiers est éphémère. Cela signifie que les images stockées seront automatiquement supprimées à chaque redémarrage du serveur, ce qui est le comportement idéal pour ce type d'usage temporaire et évite de saturer le disque.
