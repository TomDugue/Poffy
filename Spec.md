`pages\index.tsx` : Acceuil
    - Part 1 : Rejoindre une partie
        - TextInput "Code de la partie"
        - Bouton "Go"
    - Part 2 : Créer une partie
        - Bouton "Connect to Spotify"
`pages\creation.tsx` : Création

`pages\room\[id].tsx` : Rooms


# USECASES

## `Master`
- L'utilisateur se connecte à l'application
-> s'il n'est pas un compte premimum, message d'erreur sur l'acceuil
- Création d'un lobby
- L'utilisateur accède a la page de gestion du lobby où un lien de partage est disponible
- L'utilisateur peut changer la configuration du lobby
  - ...
- L'utilisateur peut lancer la partie
- L'utilisateur peut voir :
  - La liste des joueurs
  - Ecouter la musique
  - Voir le score
  - Voir le temps restant
- L'utilisateur propose une réponse
- Quand tous les utilisateurs ont répondu ou que le temps est écoulé, La réponse est affichée
- Quand la réponse est affichée, le master peut passer à la musique suivante

## `Player`
- L'utilisateur accède a la room via le lien de partage
- L'utilisateur choisit un pseudo
- L'utilisateur peut voir :
  - La liste des joueurs et qui est le master
  - Ecouter la musique
  - Voir le score
  - Voir le temps restant
- L'utilisateur propose une réponse
- Quand tous les utilisateurs ont répondu ou que le temps est écoulé, La réponse est affichée
- Quand la réponse est affichée, le master peut passer à la musique suivante