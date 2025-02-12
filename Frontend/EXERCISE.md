# Exercice : Créer une Application Web3 modulaire qui gère les évènements blockchain

## Objectifs
- Comprendre et reproduire une architecture existante
- Implémenter la gestion des événements blockchain
- Utiliser les composants shadcn/ui
- Structurer une application de manière modulaire

## Contexte
Vous disposez d'un projet Frontend basique avec un contrat intelligent SimpleStorage. Votre mission est de reproduire l'architecture et les fonctionnalités du projet cible tout en comprenant chaque aspect de l'implémentation.

## Structure à Reproduire

```
Frontend/
  ├── components/
  │   ├── shared/
  │   │   ├── Event.jsx        // Composant pour afficher un événement
  │   │   ├── Footer.jsx       // Pied de page de l'application
  │   │   ├── Header.jsx       // En-tête avec connexion wallet
  │   │   ├── Layout.jsx       // Structure principale de l'application
  │   │   ├── NotConnected.jsx // Message si wallet non connecté
  │   │   └── SimpleStorage.jsx // Logique principale du contrat
  │   └── ui/                  // Composants shadcn
  ├── constants/
  │   └── index.js            // Configuration et constantes
  └── utils/
      ├── client.js           // Configuration du client blockchain
      └── sepolia.js          // Configuration du réseau

## Étapes de l'Exercice

### 1. Installation et Configuration

1. Installez les dépendances nécessaires :
   ```bash
   pnpm install @shadcn/ui
   ```

2. Configurez shadcn/ui :
   ```bash
   pnpm dlx shadcn-ui@latest init
   ```

3. Installez les composants requis :
   ```bash
   pnpm dlx shadcn-ui@latest add card badge button input alert toast
   ```

### 2. Reproduction des Composants

#### 2.1 Composants UI
Reproduisez les composants UI en suivant la structure du projet cible :

1. Event.jsx
   - Utilise Card et Badge de shadcn
   - Affiche les détails d'un événement blockchain
   - Gère le formatage des données

2. SimpleStorage.jsx
   - Implémente la logique de lecture/écriture du contrat
   - Utilise les hooks wagmi pour les interactions blockchain
   - Gère les événements et les états de transaction

3. Layout.jsx et autres composants structurels
   - Mettez en place la structure de base de l'application
   - Intégrez les composants Header et Footer
   - Gérez la connexion du wallet

#### 2.2 Gestion des Événements
Implémentez la logique de gestion des événements dans SimpleStorage.jsx :

```javascript
const getEvents = async() => {
    const numberChangedLog = await publicClient.getLogs({
        address: contractAddress,
        event: parseAbiItem('event NumberChanged(uint oldValue, uint newValue)'),
        fromBlock: 0n,
        toBlock: 'latest'
    })
    setEvents(numberChangedLog.map(
        log => ({
            oldValue: log.args.oldValue.toString(),
            newValue: log.args.newValue.toString()
        })
    ))
}
```

### 3. Gestion des États et Interactions

1. Implémentez les hooks wagmi :
   ```javascript
   const { data: numberGet, refetch } = useReadContract({
     address: contractAddress,
     abi: contractAbi,
     functionName: 'retrieve'
   })

   const { writeContract } = useWriteContract()
   ```

2. Gérez les états de transaction :
   - Affichez les états en cours
   - Gérez les erreurs
   - Mettez à jour l'interface après les transactions

### 4. Notifications et Retours Utilisateur

Utilisez le système de toast pour les notifications :
```javascript
const { toast } = useToast()

// Exemple d'utilisation
toast({
  title: "Succès",
  description: "Votre nombre a été inscrit dans la Blockchain",
  className: "bg-lime-200"
})
```

## Critères d'Évaluation

1. **Fonctionnalités (40%)**
   - Reproduction fidèle des fonctionnalités du projet cible
   - Gestion correcte des événements blockchain
   - Interactions réussies avec le contrat

2. **Interface Utilisateur (30%)**
   - Utilisation correcte des composants shadcn
   - Reproduction fidèle du design
   - Gestion des états de chargement et des erreurs

3. **Code Quality (30%)**
   - Organisation du code
   - Utilisation des hooks et des composants
   - Gestion des états

## Ressources

- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [Documentation Wagmi](https://wagmi.sh/)
- [Documentation Viem](https://viem.sh/)
