/**
* Classe HealthBar.
* Gère la barre de vie d'un joueur ou d'un ennemi.
*/
export default class HealthBar {
    /**
    * Constructeur de la barre de vie.
    * Initialise la barre de vie et sa position dans la scène.
    * @param {Phaser.Scene} p_scene - La scène où la barre de vie est ajoutée.
    * @param {number} p_x - Position X de la barre de vie.
    * @param {number} p_y - Position Y de la barre de vie.
    */
    constructor(p_scene, p_x, p_y) {
        this.m_scene = p_scene;  // Scène associée à la barre de vie
        this.m_x = p_x;          // Position X
        this.m_y = p_y;          // Position Y
        this.m_health = 3;       // Santé initiale
        
        // Ajouter le sprite de la barre de vie
        this.m_sprite = this.m_scene.add.sprite(this.m_x, this.m_y, 'healthbar').setOrigin(0.5);
        
        // Initialiser la barre de vie
        this.updateHealthBar();
    }
    
    /**
    * Réduit la santé et met à jour la barre de vie.
    */
    takeDamage() {
        if (this.m_health > 0) {
            this.m_health--; // Réduire la santé
            console.log('Santé actuelle :', this.m_health); // Afficher la santé actuelle
            this.updateHealthBar(); // Mettre à jour la barre de vie
        }
    }
    
    /**
    * Met à jour le visuel de la barre de vie en fonction de la santé.
    */
    updateHealthBar() {
        // Vérifie que la valeur de m_health est au moins 0
        if (this.m_health >= 0) {
            this.m_sprite.setFrame(this.m_health); // Met à jour le frame de la barre
        }
    }
}