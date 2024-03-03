# POFFY
Welcome to this project

# Description
Online Blindtest using Spotify API
Play with your friends and Family and try to guess the current song playing !
Create or Join a private room to play, share the code to your team, select a playlist and you're ready to go.

# Team
- Dugué Tom             *(Back-End (server & Api connexion))*
- Airaud Syndelle       *(Front-End)*
- Papin Noémie          *(Full stack)*
- Raimbault Alexandre   *(Full stack)*

# Technologies
Node.js
React
Chakra-UI
Spotify API
Socket.io

# Link to play :
- Pas de lien pour jouer pour le moment. L'application est en cours de développement et est accessible à un nombre limité de compte Spotify.

# Bugs
- Pas de redirection (page vide) si la game est pleine, en partie ou si le code est invalide
- Recharger la page réinitialise la connexion (ajouter des cookies pour garder la connexion)
- Pas de verification sur les paramètres de la partie (nombre de chanson, nombre de joueur, ...)
- Possibilité de rejoindre deux fois avec le même compte Spotify (et donc problème de racing entre les deux clients)

## Installation
You must have nodejs installed on your machine.

```bash
git clone https://github.com/TomDugue/Poffy.git
cd poffy
cd client && npm install
cd ../server && npm install
```

## Update
```bash
git pull
cd client && npm install
cd ../server && npm install
```

## Run
To start the project you must run the following commands in two different terminals.
```bash
cd client && npm start
```
```bash
cd server && npm start
```