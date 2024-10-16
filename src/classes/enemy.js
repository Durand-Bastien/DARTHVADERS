export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        if (!scene) {
            console.error("La scène est indéfinie dans le constructeur Enemy !");
        }

        // Ajouter l'ennemi à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Paramètres spécifiques à l'ennemi
        this.setCollideWorldBounds(true);

        // Jouer l'animation 'enemy_idle'
        this.play('enemy_idle');
    }
}