import { Scene } from 'phaser';

/**
* Scène MainMenu.
* Affiche le menu principal avec un bouton pour commencer le jeu.
*/
export class MainMenu extends Scene {
    /**
    * Constructeur de la scène MainMenu.
    */
    constructor() {
        super('MainMenu'); // Identifiant unique de la scène
    }
    
    /**
    * Création de la scène MainMenu.
    * Initialise le logo et le bouton "Jouer".
    */
    create() {
        const centerX = this.scale.width / 2; // Centre horizontal de l'écran
        const centerY = this.scale.height / 2; // Centre vertical de l'écran
        
        // Ajouter le logo au centre, légèrement au-dessus
        this.add.image(centerX, centerY - 120, 'logo').setOrigin(0.5);
        
        // Ajouter le texte "Jouer" en tant que bouton
        const playText = this.add.text(
            centerX, // Position horizontale (centre de l'écran)
            centerY + 50, // Position verticale
            'Jouer', // Texte affiché
            {
                fontFamily: 'Arial Black', // Police de caractères
                fontSize: '48px', // Taille de la police
                color: '#ffffff', // Couleur initiale du texte
                stroke: '#000000', // Contour noir
                align: 'center' // Alignement du texte
            }
        ).setOrigin(0.5); // Centre le texte autour de son point d'origine
        
        // Rendre le texte interactif pour détecter les clics et les survols
        playText.setInteractive({ useHandCursor: true });
        
        // Effet de survol : changer la couleur du texte en jaune
        playText.on('pointerover', () => {
            playText.setStyle({ color: '#FFE81F' });
        });
        
        // Effet de sortie du survol : revenir à la couleur blanche
        playText.on('pointerout', () => {
            playText.setStyle({ color: '#ffffff' });
        });
        
        // Gestion du clic sur le bouton "Jouer"
        this.input.once('pointerdown', () => {
            this.scene.start('Game'); // Transition vers la scène Game
        });
    }
}