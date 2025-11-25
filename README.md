# STL Viewer - Full Stack Next.js Application

Ce projet est une application web complète permettant de visualiser des fichiers 3D (format STL) directement dans le navigateur. Il a été réalisé par **Rochdi Fridhi** dans le cadre d'un test technique pour **SeekMake**.

🔗 **Démo en ligne :** [https://seekmake-test.vercel.app/](https://seekmake-test.vercel.app/)

## 🛠 Technologies Utilisées

*   **Framework :** Next.js 16 (App Router)
*   **Langage :** TypeScript
*   **3D Engine :** Three.js / @react-three/fiber / @react-three/drei
*   **Base de données :** PostgreSQL (NeonDB)
*   **ORM :** Prisma
*   **Styling :** Tailwind CSS
*   **Déploiement :** Vercel

## 💡 Approche Technique et Logique (Algorithmes)

Voici une explication détaillée de la logique et des algorithmes mis en œuvre pour réaliser ce projet, sans entrer dans le code brut.

### 1. Visualisation 3D et Gestion de la Scène
L'objectif principal était de rendre le visionnage de fichiers 3D fluide et accessible sans installation de logiciel tiers.
*   **Moteur de Rendu :** J'ai utilisé une abstraction de WebGL via Three.js. L'algorithme de rendu initialise une "Scène" virtuelle contenant une caméra et des lumières (ambiante et directionnelle) pour simuler un environnement réaliste.
*   **Chargement Asynchrone :** Le chargement des fichiers STL (souvent lourds) se fait de manière asynchrone. L'application télécharge le fichier binaire, le parse pour extraire la géométrie (sommets et faces), puis génère un maillage (Mesh) 3D.
*   **Centrage et Mise à l'Échelle Automatique :** Un algorithme calcule la "Bounding Box" (boîte englobante) de l'objet importé. Ensuite, il redimensionne automatiquement l'objet pour qu'il tienne parfaitement dans la vue de la caméra et le centre au point (0,0,0) de la scène, garantissant que l'utilisateur voit toujours l'objet entier dès l'ouverture.

### 2. Architecture Full Stack et Gestion des Données
L'application suit une architecture moderne séparant le Frontend (Interface) du Backend (API), tout en étant hébergée dans un seul projet (Monorepo Next.js).
*   **Flux d'Upload :** Lorsqu'un utilisateur téléverse un fichier, celui-ci est envoyé via une requête HTTP POST à l'API. Le serveur reçoit le flux de données, le sauvegarde physiquement (ou simule le stockage cloud) et crée une entrée dans la base de données PostgreSQL via Prisma.
*   **Persistance des Métadonnées :** Plutôt que de scanner le dossier de stockage à chaque requête (ce qui est lent), j'utilise la base de données pour stocker les métadonnées (Nom, URL, Taille, Date). Cela permet un affichage instantané de la liste des fichiers dans la barre latérale.

### 3. Interface Utilisateur et Responsivité
L'interface a été pensée pour être "Mobile First".
*   **Logique de la Sidebar (Barre Latérale) :** Un état global gère la visibilité de la barre latérale. Sur mobile, un algorithme détecte la largeur de l'écran : si l'utilisateur sélectionne un fichier, la barre latérale se ferme automatiquement pour laisser toute la place au visualiseur 3D.
*   **Performance UI :** L'interface utilise des composants React optimisés pour ne rafraîchir que les parties nécessaires (par exemple, seul le canvas 3D est redessiné lors de la manipulation de l'objet, pas toute la page).

### 4. Optimisation du Build (CI/CD)
Pour assurer un déploiement continu sur Vercel :
*   Un script spécifique a été mis en place pour générer le client Prisma avant la compilation du projet Next.js. Cela garantit que le serveur de production dispose toujours des définitions de types les plus récentes correspondant au schéma de la base de données.

## 🚀 Installation et Lancement

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/Fridhi-Rochdi/seekmake-test.git
    cd seekmake-test/next-app
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement :**
    Créez un fichier `.env` à la racine et ajoutez votre URL de base de données :
    ```env
    DATABASE_URL="votre_url_postgresql"
    ```

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.
