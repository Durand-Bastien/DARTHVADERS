/**
* Classe HealthBar.
* Gère la barre de vie d'un joueur ou d'un ennemi.
*/
export default class HealthBar {
    /**
    * Constructeur de la barre de vie.
    * Initialise la barre de vie et sa position dans la scène.
    * @param {Phaser.Scene} scene - La scène où la barre de vie est ajoutée.
    * @param {number} x - Position X de la barre de vie.
    * @param {number} y - Position Y de la barre de vie.
    */
    constructor(scene, x, y) {
        this.scene = scene; // Scène associée à la barre de vie
        this.x = x;         // Position X
        this.y = y;         // Position Y
        this.health = 3;    // Santé initiale
        
        // Ajouter le sprite de la barre de vie
        this.sprite = this.scene.add.sprite(this.x, this.y, 'healthbar').setOrigin(0.5);
        
        // Initialiser la barre de vie
        this.updateHealthBar();
    }
    
    /**
    * Réduit la santé et met à jour la barre de vie.
    */
    takeDamage() {
        if (this.health > 0) {
            this.health--; // Réduire la santé
            console.log('Santé actuelle :', this.health); // Afficher la santé actuelle
            this.updateHealthBar(); // Mettre à jour la barre de vie
        }
    }
    
    /**
    * Met à jour le visuel de la barre de vie en fonction de la santé.
    */
    updateHealthBar() {
        if (this.health >= 0) {
            this.sprite.setFrame(this.health); // Met à jour l'image de la barre
        }
    }
}