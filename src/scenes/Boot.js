import { Scene } from 'phaser';

/**
* Scène Boot.
* Utilisée pour initialiser les ressources nécessaires avant de passer au Preloader.
*/
export class Boot extends Scene {
    /**
    * Constructeur de la scène Boot.
    */
    constructor() {
        super('Boot'); // Identifiant unique de la scène
    }
    
    /**
    * Création de la scène Boot.
    * Passe immédiatement à la scène Preloader.
    */
    create() {
        this.scene.start('Preloader'); // Transition vers la scène Preloader
    }
}