# SuperVentesAPI

API de l'application SuperVentes dans le cadre de l'UE HMIN102.

## Auteurs
Charles DESGENETEZ & Maxime REITER

## Application de démonstration
Une application de démonstration est disponible à l'adresse `https://superventes.dorpax.io`. 

L'API est disponible pour interrogation à l'adresse ``https://superventes.dorpax.io/api/``.

## Installer le serveur

### Pré-requis
Vous devez avoir d'installer Node.Js et MongoDB.

### Installation
```bash
git clone git@github.com:Dorpaxio/SuperVentesAPI.git
cd SuperVentesAPI/
npm install
```

## Exécution du serveur
### Exécution basique
À utiliser pour la version en développement.
```bash
node index.js
```

### Exécution en production
Nécessite le package npm PM2.

#### Générer les certificats pour les jsonwebtoken
Créez un dossier private dans la racine et rentrez dedans.
Il faut ensuite générer les certificats.
```
mkdir private
cd private
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
#### Variables d'environnement
Il y a plusieurs variables d'environnement à paramétrer.
```bash
export SUPERVENTES_DOMAIN=<nom de domaine de l'env de production>
export SUPERVENTES_PORT=<le port d'exécution (défaut 1311)>
export SUPERVENTES_DB=superventes
```
#### Exécution
```bash
pm2 start index.js
```
