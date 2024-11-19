export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, maxHp=100, speed=160, currentWeapon='default') 
    {
        // Appelle le constructeur parent
        super(scene, x, y, texture);

        // Ajoute le joueur à la scène et lui assigne un corps physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Définit des propriétés du joueur
        this.speed = speed;      // Vitesse de déplacement
        this.maxHp = maxHp;      // Points de vie max du joueur 
        this.currentHp = maxHp;  // Points de vie actuels du joueur
        this.isAlive = true;     // Indique si le joueur est vivant
        this.currentWeapon = currentWeapon;
        
        // Configuration du corps physique du joueur
        this.setCollideWorldBounds(true);  // Le joueur ne sort pas des limites du monde

        // Jouer l'animation 'player_idle'
        this.play('player_idle');
    }

    move(cursors)
    {
        if(this.isAlive)
        {
            // Réinitialiser la vélocité du joueur
            this.setVelocity(0);

            // Vérifier les touches enfoncées
            if (cursors.left.isDown) {
                this.setVelocityX(-this.speed);  // Déplace vers la gauche
            }
            else if (cursors.right.isDown) {
                this.setVelocityX(this.speed);   // Déplace vers la droite
            }
        }
        
    }

    // Méthode pour recevoir des dégâts
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.isAlive = false;
            this.die();
        }
    }

    // Méthode appelée lorsque le joueur meurt
    die() {
        this.setTint(0xff0000);  // Change la couleur du sprite
        this.setVelocity(0, 0);  // Arrête le joueur
        // Autres actions à effectuer à la mort, comme jouer une animation ou changer de scène
    }
}