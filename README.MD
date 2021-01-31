# The Blockchain Lottery

Un système de loterie décentralisé sur la blockchain publique Ethereum.

>**IMPORTANT :** ce projet est uniquement à but **pédagogique** et tente de mettre en lumière les potentiels de la technologie blockchain. Il s'inspire notamment du tutoriel [https://blog.chain.link/how-to-build-a-blockchain-lottery-2/](https://blog.chain.link/how-to-build-a-blockchain-lottery-2/). Je tiens à préciser que l'intégralité du code n'a ni été suffisamment testé, ni audité, et pourrait présenter des anomalies. De plus, les loteries sont des pratiques commerciales hautement réglementées dans la plupart des pays, dont en France. **Vous êtes seul responsable de l'utilisation que vous pourrez en faire !**


### I. La blockchain : une ( r )évolution

[Blockchain France](https://blockchainfrance.net/) définit la blockchain comme « une technologie de stockage et de transmission d’informations, transparente, sécurisée, et fonctionnant sans organe central de contrôle ». Il s'agit d'une base de données décentralisée et distribuée au sein d'un réseau pair à pair (Bitcoin, Ethereum...), qui contient l'historique de toutes les informations (transactions, titres de propriété, contrats...) effectuées entre ses utilisateurs depuis sa création. Ces informations sont validées par les participants du réseau (les noeuds) selon un algorithme de consensus inscrit dans son protocole, et s'appuyent sur la cryptographie (fonctions de hachage) pour garantir leur intégrité. Pour une démonstration visuelle, voir : [https://andersbrownworth.com/blockchain/](https://andersbrownworth.com/blockchain/)

Ses fondements s’articulent autour de 6 grands principes :
- Un registre distribué, consultable par tous, et contenant un historique de tous les échanges effectués entre ses utilisateurs,
- Le consensus : la validation des échanges résulte d’un consensus distribué et non plus d’une autorité centrale qui garde le contrôle total sur les données (cela en fait notamment un formidable outil anti-censure),
- L’immuabilité : il est impossible de modifier ou supprimer des écritures une fois validées et enregistrées dans le registre (à moins d'une [attaque des 51%](https://fr.wikipedia.org/wiki/Attaque_des_51_%25)),
- La sécurité,
- La désintermédiation : les autorités de confiance historiques (avocats, notaires, banques, assurances...) sont "remplacées" par des programmes informatiques basés sur des calculs purement mathématiques,
- La transparence et la confiance.

Le [Bitcoin](https://bitcoin.org/fr/) reste sans doute aujourd'hui l'utilisation la plus connue de la technologie blockchain.

### II. QUID des smarts contracts ?

Un smart contract (contrat "intelligent") n'est ni plus ni moins qu'un programme informatique stocké à une adresse sur la blockchain et dont le protocole assure qu'il s'exécutera automatiquement et quoiqu'il arrive dès lors que les conditions codées dans le contrat sont réunies (puisqu'on ne peut plus modifier le code et donc empêcher son exécution une fois que le programme est stocké sur la blokchain).

Couplé à d'autres technologies, comme par exemple les objets connectés, les smart contracts promettent de disrupter de nombreux secteurs. L'exemple le plus simple est peut-être celui des assurances paramétriques : nous pourrions alors imaginer un contrat qui rembourse automatiquement, instantanément et sans contestation possible une somme P à un groupe d'agriculteurs G dès lors qu'il n'a pas plu une certaine quantité d'eau Q dans une zone géographique Z, sur une période de temps T et pendant plus de X jours d'affilés. Tous ces paramètres seraient bien entendu définis à l'avance et inscrits dans le contrat. Le contrat serait ensuite nourri par des données fournies par des [API](https://fr.wikipedia.org/wiki/Interface_de_programmation) météo et communiquées par l'intermédiaire d'un réseau d'[Oracles](https://www.ethereum-france.com/les-oracles-lien-entre-la-blockchain-et-le-monde/), puis s'exécuterait de manière autonome dès lors que les conditions seraient remplies.

Nous tenterons ici d'explorer l'ensemble de ces promesses à travers un projet de moins grande envergure : une loterie décentralisée sur la blockchain [Ethereum](https://ethereum.org/fr/).

### III. Une loterie décentralisée : quel intérêt ?

L'organisation d'une loterie peut soulever un certain nombre de problématiques :

- Qu'est-ce qui nous garantit que le vainqueur sera bien choisi au hasard ?
- Quelle méthode est utilisée pour le tirage au sort ? Est-elle vraiment équitable pour tous ?
- Les organisateurs de la loterie ou l'huissier en charge du contrôle du tirage au sort sont-ils des personnes fiables ?
- Le système de tirage au sort est-il sécurisé ?
- Ai-je au moins la garantie de recevoir mon argent si je suis tiré au sort ? Et dans quels délais ?

De plus, elle demande, dans un système traditionnel et centralisé, de mobiliser de nombreuses ressources pour assurer la vente et la distribution des tickets, ou encore la maintenance et la sécurité des serveurs sur lesquels sont stockées les données afin de prévenir d'éventuelles attaques informatiques (piratage et corruption des données, modification du vainqueur, détournement des fonds récoltés...).

A l'inverse, dans un système décentralisé, quelques heures de travail et un développeur suffisent pour organiser une loterie au moins aussi sécurisée et complètement autonome sur la blockchain Ethereum :

[![schema-blockchain-lottery.png](https://i.postimg.cc/KY89bsB1/schema-blockchain-lottery.png)](https://postimg.cc/QFvgkm6D)

Ainsi, une loterie décentralisée sur la blockchain permet de résoudre à moindre coût l'ensemble des problématiques évoquées.

### IV. Stack technique du projet

##### a. Côté front-end :

Nous retrouverons côté front-end une application classique développée avec la librairie [React.js](https://fr.reactjs.org/). Afin d'intéragir avec la blockchain Ethereum (testnet [Kovan](https://ethereum.org/fr/developers/docs/networks/#testnets)) et faire appel aux méthodes de notre contrat de loterie, nous utiliserons la librairie [Ethers.js](https://github.com/ethers-io/ethers.js/). Nous devrons également pour cela nous fournir une clé API sur [Alchemy](https://www.alchemyapi.io/), [Etherscan](https://etherscan.io/), et [Infura](https://infura.io/) afin de nous connecter à des noeuds du réseau. Enfin, nous utiliserons l'extension [Metamask](https://metamask.io/) sur notre navigateur web pour gérer un portefeuille qui nous permettra d'acheter un ticket de loterie et de tester notre application.

##### b. Côté Ethereum :

Nos contrats permettant de gérer notre loterie seront écrits avec le langage de programmation [Solidity](https://docs.soliditylang.org/), créé pour Ethereum. Afin de faciliter le développement du projet et le déploiement des contrats sur le testnet d'Ethereum Kovan, nous utiliserons la suite [Truffle](https://www.trufflesuite.com/truffle). Pour le déploiement, nous utiliserons là encore Infura avec la même clé API.

Enfin, nos contrats intègreront plusieurs fonctionnalités du réseau d'Oracles décentralisé [Chainlink](https://chain.link/), sans lequel notre loterie ne pourrait pas fonctionner :

- [Alarm Clock](https://docs.chain.link/docs/chainlink-alarm-clock) (testnet) : qui nous permettra de déclencher la fin de la loterie à une heure programmée lors du déploiement du contrat,
- [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf) : qui nous permettra de générer un nombre aléatoire pour sélectionner le gagnant à qui transférer les fonds de la loterie (et dont le caractère alétoire du nombre généré pourra être vérifié publiquement sur la blockchain).

>**Note :** pour une très bonne introduction à Chainlink et plus globalement, comprendre l'importance des Oracles et leurs enjeux, lire : [Completing The God Protocols: A Comprehensive Overview of Chainlink in 2021](https://smartcontentpublication.medium.com/completing-the-god-protocols-a-comprehensive-overview-of-chainlink-in-2021-746220a0e45)

### V. Installation

>**Avant de poursuivre :** n'oubliez pas de vous inscrire sur Alchemy, Etherscan et Infura afin de récupérer vos clés API. Vous aurez également besoin d'un portefeuille Ethereum afin de déployer les contrats (que vous pouvez créer [ici](https://www.myetherwallet.com/create-wallet)).

Commencez par cloner ce repository :
```sh
$ git clone git@github.com:fligflug/TheBlockchainLottery.git
```

#### a. Côté Ethereum

Une fois à la racine du projet, exécutez les commandes suivantes :
```sh
$ cd ethereum/
$ cp .env.dev .env 
$ npm install 
```

Dans votre fichier .env, renseignez les informations suivantes :
```sh
CREATOR_PRIVATE_KEY="" # clé privée du portefeuille avec lequel vous allez déployer les contrats ; 
INFURA_ENDPOINT="" # lien https à retrouver dans votre projet Infura > onglet settings > rubrique keys > endpoints (choisir "Kovan")
LOTTERY_CONTRACT_ADDRESS="" # adresse du contrat de loterie ; à renseigner après le déploiement
LOTTERY_TICKET_PRICE="" # le prix du ticket, en Ether et non en wei (par exemple, 0.01)
LOTTERY_DURATION="" # la durée de la loterie, en secondes (par exemple, 3600 pour une heure)
```

>**IMPORTANT :** bien entendu, votre fichier .env ne devrait pas être versionné. Aussi, si vous disposez d'un portefeuille personnel et que vous l'utilisez pour déployer les contrats (déconseillé), ne laissez surtout pas trainer votre clé privée !!! :)

Puis exécutez la commande suivante :
```sh
$ truffle compile
$ truffle migrate --network kovan 
```

Suivez enfin les instructions affichées dans le terminal en fin de commande :

```sh
   > [OK] contract deployed on Kovan testnet network (see https://kovan.etherscan.io)
   > Next, fund the following contracts with Chainlink Kovan Faucet (see https://kovan.chain.link/): # vous devrez envoyer des faux jetons link (valables uniquement sur le testnet Kovan) à vos contrats qui utiliseront les fonctionnalités du réseau d'Oracles décentralisé Chainlink
   > Lottery contract: # [adresse de votre contrat de loterie]
   > RandomNumberConsumer contract: # [adresse de votre contrat en charge de générer le nombre aléatoire (appelé par votre contrat de loterie)]
   > /!\ Do not forget to add the lottery contract address in your .env file. You can also set the ticket price and duration you want. # Vous pouvez désormais ajouter l'adresse de votre contrat de loterie dans votre .env.LOTTERY_CONTRACT_ADDRESS
   > Then, fund the following wallet with Ethereum Kovan faucet (see https://faucet.kovan.network/): # vous devrez envoyer des faux eth sur votre portefeuille pour démarrer la loterie (attention : seul l'adresse utilisée pour déployer les contrats détient le droit de démarrer la loterie)
   > Wallet: [portefeuille utilisé pour déployer les contrats]
   > This wallet will serve to start the new lottery: 
   > To do that, finally run start_lottery.js script with truffle exec cmd. # voir partie b. Côté front-end
   ```

#### b. Côté front-end

Une fois à la racine du projet, exécutez les commandes suivantes :
```sh
$ cd ../front-end/
$ cp .env.dev .env 
$ npm install 
```

Dans votre fichier .env, renseignez les informations suivantes :
```sh
REACT_APP_ENV="" # DEV pour le debug en console
REACT_APP_LOTTERY_CONTRACT_ADDRESS="" # adresse du contrat de loterie 
REACT_APP_INFURA_PROJECT_ID="" # clé project ID de votre projet Infura
REACT_APP_ALCHEMY_API_KEY="" # API key de votre compte Alchemy
REACT_APP_ETHERSCAN_API_KEY="" # API key de votre compte Etherscan
```

Puis exécuter les commandes suivantes :
```sh 
$ npm start # votre app react sera disponible sur http://localhost:3000/ 
$ cd ../ethereum/
$ truffle exec ./scripts/start_lottery.js --network kovan
```

Votre loterie est désormais lancée, et vous n'avez plus rien à faire ! Le gagnant sera automatiquement désigné à l'heure programmée et les fonds transférés dans la foulée. Magique, non ?

### VI. Démonstration

[Voir la démo ](https://streamable.com/ynv2ki)

### VII. Comment améliorer ce projet ?

Je rappelle que ce projet n'est qu'un prototype à but pédagogique. Il ne respecte donc pas forcément toutes les bonnes pratiques en matière de développement. Voici quelques pistes pour l'améliorer :

- **En priorité** : écrire des tests ! Cet [article](https://blog.chain.link/testing-chainlink-smart-contracts/) constituera certainement un bon point de départ sur les différentes techniques pouvant être utilisées pour tester des smart contracts avec Chainlink (qui rend la tâche un peu plus compliquée),
- Ajouter une fonctionnalité permettant aux participants de payer leur ticket avec d'autres tokens [ERC-20](https://www.ethereum-france.com/qu-est-ce-qu-un-token-erc20/),
- Ajouter une fonctionnalité permettant d'acheter, avec un même portefeuille, plusieurs tickets afin d'augmenter ses chances d'être tiré au sort,
- Intégrer d'autres types de wallet,
- Créer une interface côté front-end permettant à des administrateurs de créer une nouvelle loterie (piste : créer un smart contract qui servira de factory).


**Flig Flug.**