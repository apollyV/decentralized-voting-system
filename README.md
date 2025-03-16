# Decentralized Vote System

Notre projet est une DAO, les utilisateurs peuvent créer des propositions de vote, vote pour ou contre avec un commentaire. Il est également possible de supprimer les propositions de vote que l'on a créé. Les votes sont stockés sur la blockchain Ethereum.

## Fonctionnalités Clés :

- Lister les votes.
- Afficher les détails d'une proposition de vote, la date de début et de fin des votes, les votes pour et contre avec les commentaires, la description de la proposition et l'auteur de celle-ci.
- Voter pour ou contre un vote avec un commentaire.
- Supprimer un vote que l'on a créé.

## Notre équipe :

- Constant VENNIN
- Théo ERNOULD
- Antoine CHAUVIN

## [Vidéo de démonstration](https://youtu.be/I_G9H-a4f-M)

## [Business Model Canva](https://miro.com/app/board/uXjVLhAk-Zw=/?share_link_id=905474160202)

## [Slides de la présentation](https://www.canva.com/design/DAGhst-dQDM/PXNVwj3I2uQldEdz8xU9ug/edit?utm_content=DAGhst-dQDM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Stack technique : 

### Frontend :
- Framework : Next.js
- Librairie : React, Tailwind CSS, HeroUI
- Langage : TypeScript

### Backend : 
- Blockchain : Hardhat
- Langage : Solidity
- Tests unitaires : Javascript, Chai

## Lancer le projet :

### Backend
#### 1. Installation des dépendances node
```bash
npm run install:backend
```
#### 2. Installation de Hardhat (si ce n'est pas déjà fait)

Linux / MacOS :

```bash
sudo npm i --global hardhat
```

Windows : 

```bash
npm i --global hardhat
```

#### 3. Démarrage de la blockchain hardhat
```bash
npm run run:blochain
```
#### 4. Déploiement du contrat sur la blockchain hardhat
```bash
npm run deploy:localhost
```

### Frontend

#### 1. Installation des dépendances node
```bash
npm run install:frontend
```

#### 2. Démarrage du serveur de développement
```bash
npm run run:frontend
```

## Accéder au projet : http://localhost:3000/