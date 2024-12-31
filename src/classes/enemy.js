/**
* Classe Enemy.
* Représente un ennemi dans le jeu, capable de se déplacer et de tirer des projectiles.
*/
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur de l'ennemi.
    * Initialise les propriétés de l'ennemi et le configure dans la scène.
    * @param {Phaser.Scene} scene - La scène où l'ennemi est ajouté.
    * @param {number} x - Position initiale en X.
    * @param {number} y - Position initiale en Y.
    * @param {string} texture - Texture de l'ennemi.
    * @param {number} hp - Points de vie de l'ennemi.
    * @param {Object} target - La cible (joueur) de l'ennemi.
    * @param {number} speed - Vitesse de déplacement de l'ennemi.
    */
    constructor(scene, x, y, texture, hp, target, speed = 60) {
        super(scene, x, y, texture);
        
        // Vérification de la scène
        if (!scene) {
            console.error("La scène est indéfinie dans le constructeur Enemy !");
            return;
        }
        
        // Initialisation des propriétés
        this.scene = scene;
        this.speed = speed;
        this.maxHp = hp;
        this.currentHp = hp;
        this.isAlive = true;
        this.target = target;
        
        // Zone pour détecter les projectiles hors des limites
        this.boundsTrigger = this.scene.add.zone(-this.scene.scale.width, this.scene.scale.height + 150, this.scene.scale.width * 3, 10)
        .setOrigin(0)
        .setDepth(-1); // Zone invisible
        this.scene.physics.add.existing(this.boundsTrigger, true);
        
        // Vérifier si l'animation des projectiles ennemis existe
        if (!this.scene.anims.exists('enemy_projectile')) {
            this.scene.anims.create({
                key: 'enemy_projectile',
                frames: this.anims.generateFrameNumbers('enemy_projectile', { start: 0, end: 2 }),
                frameRate: 8
            });
        }
        
        // Ajouter l'ennemi à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Jouer l'animation idle par défaut
        this.play('enemy_idle');
    }
    
    /**
    * Déplacement de l'ennemi.
    * Définit la vélocité verticale de l'ennemi.
    */
    move() {
        if (this.isAlive) {
            this.setVelocityY(this.speed);
        }
    }
    
    /**
    * Tirer un projectile.
    * L'ennemi tire un projectile vers le bas en direction de la cible.
    * @param {number} projectileSpeed - Vitesse du projectile.
    */
    shootProjectile(projectileSpeed = 300) {
        const projectile = this.scene.enemyProjectiles.create(this.x, this.y + this.height / 2, 'enemy_projectile');
        projectile.setSize(13, 58).setOffset(0, 0).setFlipY(true);
        
        // Déplacement du projectile
        this.scene.physics.moveTo(projectile, this.x, this.y + 500, projectileSpeed);
        
        // Jouer l'animation du projectile
        projectile.anims.play('enemy_projectile');
        
        // Gérer la collision avec la cible
        this.scene.physics.add.overlap(projectile, this.target, () => {
            if (this.target.takeDamage) {
                this.target.takeDamage(1);
            }
            projectile.destroy();
        });
        
        // Détruire les projectiles hors des limites
        this.scene.physics.add.overlap(projectile, this.boundsTrigger, () => {
            projectile.destroy();
        });
    }
    
    /**
    * Gestion des dégâts reçus par l'ennemi.
    * Réduit la santé et détruit l'ennemi si ses points de vie atteignent 0.
    */
    takeDamage() {
        this.currentHp--;
        
        if (this.currentHp <= 0) {
            this.anims.play('explosion');
            this.scene.time.delayedCall(1000 / 6, () => {
                this.isAlive = false;
                this.destroy();
            });
        }
    }
    
    /**
    * Mise à jour de l'ennemi.
    * Gère le déplacement, le tir automatique, et la destruction hors des limites.
    * @param {number} time - Temps courant en millisecondes.
    */
    update(time) {
        if (this.isAlive) {
            this.move();
            
            // Tir automatique toutes les 2000 ms
            if (!this.lastShotTime) {
                this.lastShotTime = 0;
            }
            
            if (time > this.lastShotTime + 2000) {
                this.shootProjectile();
                this.lastShotTime = time;
            }
            
            // Détruire l'ennemi hors des limites
            this.scene.physics.add.overlap(this, this.boundsTrigger, () => {
                this.isAlive = false;
                this.destroy();
            });
        }
    }
}