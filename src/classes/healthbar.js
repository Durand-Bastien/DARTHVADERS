export default class HealthBar {
    constructor(scene, x, y) {
        // Choix de la scène et des coordonnées de la barre de vie
        this.scene = scene;
        this.x = x;
        this.y = y;
        // Ajouter le sprite de la barre de vie
        this.sprite = this.scene.add.sprite(x, y, 'healthbar').setOrigin(0.5);
        // Santé du joueur
        this.health = 3;
        // Initialiser la santé du joueur à 3
        this.updateHealthBar();
    }

    takeDamage() {
        // Réduire la santé du joueur
        this.health -= 1;
        // Afficher la vie actuelle dans la console
        console.log('Santé actuelle :', this.health);
        // Mettre à jour l'affichage de la barre
        this.updateHealthBar();
    }

    updateHealthBar() {
        // Met à jour le spritesheet de la barre de vie
        this.sprite.setFrame(this.health);
    }
}