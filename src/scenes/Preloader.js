import { Scene } from 'phaser';

/**
* Scène Preloader.
* Responsable de l'affichage de la barre de chargement et du chargement des ressources nécessaires au jeu.
*/
export class Preloader extends Scene {
    /**
    * Constructeur de la scène Preloader.
    */
    constructor() {
        super('Preloader'); // Identifiant unique de la scène
    }
    
    /**
    * Initialisation de la scène Preloader.
    * Configure la barre de progression et le texte de chargement.
    */
    init() {
        const v_centerX = this.scale.width / 2; // Centre horizontal
        const v_centerY = this.scale.height / 2; // Centre vertical
        
        // Bordure de la barre de progression
        this.add.rectangle(v_centerX, v_centerY, 468, 32).setStrokeStyle(1, 0xffffff);
        
        // Barre de progression interne
        const v_progressBar = this.add.rectangle(v_centerX - 230, v_centerY, 4, 28, 0xffffff);
        
        // Texte de chargement
        const v_loadingText = this.add.text(v_centerX, v_centerY - 50, 'Chargement...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Mise à jour de la barre de progression en fonction du chargement
        this.load.on('progress', (v_progress) => {
            v_progressBar.width = 4 + (460 * v_progress);
        });
        
        // Mise à jour du texte lorsque le chargement est terminé
        this.load.on('complete', () => {
            v_loadingText.setText('Chargement terminé !');
        });
    }
    
    /**
    * Chargement des ressources nécessaires.
    */
    preload() {
        this.load.setPath('assets'); // Définir le chemin des assets
        
        // Charger les ressources du jeu
        this.load.image('logo', 'logo.png');
        this.load.image('background', 'background.png');
    }
    
    /**
    * Création de la scène Preloader.
    * Passe à la scène suivante après une transition fluide.
    */
    create() {
        this.cameras.main.fadeOut(1000, 0, 0, 0); // Transition avec un fondu noir
        
        // Lancer la scène MainMenu après la transition
        this.time.delayedCall(1000, () => {
            this.scene.start('MainMenu');
        });
    }
}