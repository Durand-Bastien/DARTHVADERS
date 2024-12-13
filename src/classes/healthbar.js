export default class HealthBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Ajouter le sprite de la barre de vie
        this.sprite = this.scene.add.sprite(x, y, 'healthbar').setOrigin(0.5);

        // Santé maximale et actuelle
        this.maxHealth = 4; // Nombre de frames dans le spritesheet (de 0 à 4)
        this.currentHealth = 0; // On commence avec une barre pleine (frame 0)

        this.updateHealthBar(); // Initialiser la barre
    }

    takeDamage() {
        // Incrémenter l'index des frames, mais ne pas dépasser la santé max
        this.currentHealth = Math.min(this.currentHealth + 1, this.maxHealth);

        // Message de test de la barre de vie
        console.log('Santé actuelle :', this.currentHealth);

        // Mettre à jour l'affichage de la barre
        this.updateHealthBar();
    }

    updateHealthBar() {
        // Met à jour le frame en fonction de la santé actuelle
        this.sprite.setFrame(this.currentHealth);

        // Si la barre est vide (frame 4), déclencher un événement
        if (this.currentHealth === this.maxHealth) {
            console.log('Barre de vie vide !');
        }
    }
}