import { Scene } from 'phaser';

/**
* Scène GameOver.
* Affiche un écran de fin de partie avec un message et une option pour revenir au menu principal.
*/
export class GameOver extends Scene {
    /**
    * Constructeur de la scène GameOver.
    */
    constructor() {
        super('GameOver'); // Identifiant unique de la scène
    }
    
    /**
    * Création de la scène GameOver.
    * Affiche le logo, un message "Game Over" et un bouton "Retour" pour retourner au menu principal.
    */
    create() {
        const centerX = this.scale.width / 2; // Centre horizontal
        const centerY = this.scale.height / 2; // Centre vertical
        
        // Afficher le logo au centre, légèrement au-dessus
        this.add.image(centerX, centerY - 120, 'logo').setOrigin(0.5);
        
        // Afficher le texte "Game Over"
        this.add.text(centerX, centerY, 'Game Over', {
            fontFamily: 'Arial Black', // Police utilisée
            fontSize: '60px', // Taille du texte
            color: '#ffffff', // Couleur du texte
            stroke: '#000000', // Contour noir autour du texte
            align: 'center' // Alignement centré
        }).setOrigin(0.5);
        
        // Ajouter un bouton interactif "Retour"
        const returnText = this.add.text(centerX, centerY + 200, 'Retour', {
            fontFamily: 'Arial Black', // Police utilisée
            fontSize: '48px', // Taille du texte
            color: '#ffffff', // Couleur du texte
            stroke: '#000000', // Contour noir autour du texte
            align: 'center' // Alignement centré
        }).setOrigin(0.5);
        
        // Rendre le texte "Retour" interactif
        returnText.setInteractive({ useHandCursor: true });
        
        // Effet de survol : changer la couleur en jaune
        returnText.on('pointerover', () => {
            returnText.setStyle({ color: '#FFE81F' }); // Change la couleur en jaune
        });
        
        // Effet de sortie de survol : revenir à la couleur initiale
        returnText.on('pointerout', () => {
            returnText.setStyle({ color: '#ffffff' }); // Revenir à la couleur blanche
        });
        
        // Gestion du clic : retour au menu principal
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu'); // Transition vers la scène MainMenu
        });
    }
}