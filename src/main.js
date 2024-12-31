// Importation des scènes du jeu
import { Boot } from './scenes/Boot';          // Scène d'initialisation
import { Game } from './scenes/Game';          // Scène principale du jeu
import { GameOver } from './scenes/GameOver';  // Scène de fin de partie
import { MainMenu } from './scenes/MainMenu';  // Menu principal
import { Preloader } from './scenes/Preloader'; // Scène de chargement des ressources

// Configuration du jeu Phaser
const config = {
    type: Phaser.AUTO, // Rend automatiquement en WebGL ou Canvas selon le support
    width: window.innerWidth, // Largeur du jeu, ajustée à la taille de la fenêtre
    height: window.innerHeight, // Hauteur du jeu, ajustée à la taille de la fenêtre
    parent: 'game-container', // Conteneur HTML pour le rendu du jeu
    backgroundColor: '#000000', // Fond noir
    pixelArt: true, // Active le rendu en pixel art
    scale: {
        mode: Phaser.Scale.FIT, // Ajuste l'échelle pour s'adapter à la fenêtre
        autoCenter: Phaser.Scale.CENTER_BOTH // Centre automatiquement le contenu
    },
    physics: {
        default: 'arcade', // Utilise le moteur physique Arcade
        arcade: {
            gravity: { y: 0 } // Désactive la gravité verticale
        }
    },
    scene: [
        Boot,       // Scène d'initialisation
        Preloader,  // Scène de chargement des ressources
        MainMenu,   // Menu principal
        Game,       // Scène principale du jeu
        GameOver    // Scène de fin de partie
    ]
};

// Création et exportation de l'instance du jeu Phaser
export default new Phaser.Game(config);