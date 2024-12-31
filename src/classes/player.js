import HealthBar from './healthbar.js';

/**
* Classe Player.
* Représente le joueur dans le jeu, avec des capacités de mouvement, de tir, et une barre de vie.
*/
export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur du joueur.
    * Initialise les propriétés et la configuration physique du joueur.
    * @param {Phaser.Scene} scene - La scène où le joueur est ajouté.
    * @param {number} x - Position initiale en X.
    * @param {number} y - Position initiale en Y.
    * @param {string} texture - Texture du joueur.
    * @param {number} speed - Vitesse de déplacement.
    * @param {string} currentWeapon - Arme utilisée par défaut.
    */
    constructor(scene, x, y, texture, speed = 160, currentWeapon = 'default') {
        super(scene, x, y, texture);
        
        // Ajouter le joueur à la scène et activer son corps physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Créer une barre de vie pour le joueur
        this.healthBar = new HealthBar(scene, scene.scale.width * 0.15, scene.scale.height * 0.075);
        
        // Initialisation des propriétés du joueur
        this.setOrigin(0, 0);
        this.speed = speed;
        this.isAlive = true;
        this.currentWeapon = currentWeapon;
        this.projectiles = scene.physics.add.group();
        this.lastFiredLeft = true;
        this.enemies = {};
        
        // Zone pour détecter les projectiles hors de l'écran
        this.boundsTriggerPlayerProjectile = this.scene.add.zone(0, -30, this.scene.scale.width, 10)
        .setOrigin(0)
        .setDepth(-1);
        this.scene.physics.add.existing(this.boundsTriggerPlayerProjectile, true);
        
        // Configuration physique
        this.setCollideWorldBounds(true);
        
        // Jouer l'animation 'player_idle'
        this.play('player_idle');
        
        // Créer l'animation pour les projectiles
        this.scene.anims.create({
            key: 'player_projectile',
            frames: this.anims.generateFrameNumbers('player_projectile', { start: 0, end: 2 }),
            frameRate: 8
        });
    }
    
    /**
    * Déplacement du joueur.
    * Met à jour la position du joueur en fonction des touches pressées.
    * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors - Les touches de déplacement.
    */
    move(cursors) {
        if (!this.isAlive) return;
        
        // Réinitialiser la vélocité du joueur
        this.setVelocity(0);
        
        // Déplacer à gauche ou à droite selon les entrées
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
        }
    }
    
    /**
    * Gestion des dégâts reçus par le joueur.
    * Réduit la santé et vérifie si le joueur doit mourir.
    */
    takeDamage() {
        if (!this.isAlive) return;
        
        this.healthBar.takeDamage();
        
        if (this.healthBar.health <= 0) {
            console.log('Le joueur est mort');
            this.isAlive = false;
            this.die();
        }
    }
    
    /**
    * Action de mort du joueur.
    * Arrête le joueur et passe à l'écran Game Over.
    */
    die() {
        this.setVelocity(0, 0); // Arrêter le joueur
        this.scene.time.delayedCall(1500, () => {
            this.scene.scene.stop('Game');
            this.scene.scene.start('GameOver');
        });
    }
    
    /**
    * Permet au joueur de tirer un projectile.
    * @param {number} projectileSpeed - Vitesse du projectile.
    */
    shoot(projectileSpeed = 300) {
        const centerX = this.x + (this.width / 2);
        let projectile;
        
        // Alterner entre les tirs gauche et droite
        if (!this.lastFiredLeft) {
            projectile = this.projectiles.create(centerX + (this.width / 2), this.y + 5, 'player_projectile');
            this.scene.physics.moveTo(projectile, centerX + (this.width / 2), this.y - 500, projectileSpeed);
        } else {
            projectile = this.projectiles.create(centerX - (this.width / 2), this.y + 5, 'player_projectile');
            this.scene.physics.moveTo(projectile, centerX - (this.width / 2), this.y - 500, projectileSpeed);
        }
        this.lastFiredLeft = !this.lastFiredLeft;
        
        // Jouer l'animation du projectile
        projectile.anims.play('player_projectile');
        
        // Détruire les projectiles sortis de l'écran
        this.scene.physics.add.overlap(projectile, this.boundsTriggerPlayerProjectile, () => {
            this.projectiles.remove(projectile, true, true);
        });
    }
    
    /**
    * Ajoute une gestion de collision entre les projectiles et un ennemi.
    * @param {Phaser.GameObjects.GameObject} enemy - L'ennemi à vérifier pour les collisions.
    */
    addEnemyCollision(enemy) {
        this.projectiles.getChildren().forEach(projectile => {
            this.scene.physics.add.overlap(projectile, enemy, () => {
                if (enemy.takeDamage) {
                    enemy.takeDamage(1);
                }
                this.projectiles.remove(projectile, true, true);
            });
        });
    }
}