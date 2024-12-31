import HealthBar from './healthbar.js';

/**
* Classe Player.
* Représente le joueur dans le jeu, avec des capacités de mouvement, de tir, et une barre de vie.
*/
export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur du joueur.
    * Initialise les propriétés et la configuration physique du joueur.
    * @param {Phaser.Scene} p_scene - La scène où le joueur est ajouté.
    * @param {number} p_x - Position initiale en X.
    * @param {number} p_y - Position initiale en Y.
    * @param {string} p_texture - Texture du joueur.
    * @param {number} p_speed - Vitesse de déplacement.
    * @param {string} p_currentWeapon - Arme utilisée par défaut.
    */
    constructor(p_scene, p_x, p_y, p_texture, p_speed = 160, p_currentWeapon = 'default') {
        super(p_scene, p_x, p_y, p_texture);
        
        // Stockage de la scène et ajout du joueur
        this.m_scene = p_scene;
        this.m_scene.add.existing(this);
        this.m_scene.physics.add.existing(this);
        
        // Créer une barre de vie pour le joueur
        this.m_healthBar = new HealthBar(p_scene, p_scene.scale.width * 0.15, p_scene.scale.height * 0.075);
        
        // Initialisation des propriétés du joueur
        this.setOrigin(0, 0);
        this.m_speed = p_speed;
        this.m_isAlive = true;
        this.m_currentWeapon = p_currentWeapon;
        this.m_projectiles = this.m_scene.physics.add.group();
        this.m_lastFiredLeft = true;
        this.m_enemies = {};
        
        // Zone pour détecter les projectiles hors de l'écran
        this.m_boundsTriggerPlayerProjectile = this.m_scene.add
        .zone(0, -30, p_scene.scale.width, 10)
        .setOrigin(0)
        .setDepth(-1);
        
        this.m_scene.physics.add.existing(this.m_boundsTriggerPlayerProjectile, true);
        
        // Configuration physique
        this.setCollideWorldBounds(true);
        
        // Jouer l'animation 'player_idle'
        this.play('player_idle');
        
        // Créer l'animation pour les projectiles s'il n'existe pas déjà
        if (!this.m_scene.anims.exists('player_projectile')) {
            this.m_scene.anims.create({
                key: 'player_projectile',
                frames: this.anims.generateFrameNumbers('player_projectile', { start: 0, end: 2 }),
                frameRate: 8
            });
        }
    }
    
    /**
    * Déplacement du joueur.
    * Met à jour la position du joueur en fonction des touches pressées.
    * @param {Phaser.Types.Input.Keyboard.CursorKeys} p_cursors - Les touches de déplacement.
    */
    move(p_cursors) {
        if (!this.m_isAlive) return;
        
        // Réinitialiser la vélocité du joueur
        this.setVelocity(0);
        
        // Déplacer à gauche ou à droite selon les entrées
        if (p_cursors.left.isDown) {
            this.setVelocityX(-this.m_speed);
        } else if (p_cursors.right.isDown) {
            this.setVelocityX(this.m_speed);
        }
    }
    
    /**
    * Gestion des dégâts reçus par le joueur.
    * Réduit la santé et vérifie si le joueur doit mourir.
    */
    takeDamage() {
        if (!this.m_isAlive) return;
        
        // Réduire la vie via la HealthBar
        this.m_healthBar.takeDamage();
        
        // Vérifier si la vie est égale ou inférieure à 0
        if (this.m_healthBar.m_health <= 0) {
            console.log('Le joueur est mort');
            this.m_isAlive = false;
            this.die();
        }
    }
    
    /**
    * Action de mort du joueur.
    * Arrête le joueur et passe à l'écran Game Over.
    */
    die() {
        this.setVelocity(0, 0); // Arrêter le joueur
        this.m_scene.time.delayedCall(1500, () => {
            // Arrêter la scène de jeu et lancer GameOver
            this.m_scene.scene.stop('Game');
            this.m_scene.scene.start('GameOver');
        });
    }
    
    /**
    * Permet au joueur de tirer un projectile.
    * @param {number} p_projectileSpeed - Vitesse du projectile.
    */
    shoot(p_projectileSpeed = 300) {
        const v_centerX = this.x + this.width / 2;
        let v_projectile;
        
        // Alterner entre les tirs gauche et droite
        if (!this.m_lastFiredLeft) {
            v_projectile = this.m_projectiles.create(
                v_centerX + this.width / 2,
                this.y + 5,
                'player_projectile'
            );
            this.m_scene.physics.moveTo(
                v_projectile,
                v_centerX + this.width / 2,
                this.y - 500,
                p_projectileSpeed
            );
        } else {
            v_projectile = this.m_projectiles.create(
                v_centerX - this.width / 2,
                this.y + 5,
                'player_projectile'
            );
            this.m_scene.physics.moveTo(
                v_projectile,
                v_centerX - this.width / 2,
                this.y - 500,
                p_projectileSpeed
            );
        }
        this.m_lastFiredLeft = !this.m_lastFiredLeft;
        
        // Jouer l'animation du projectile
        v_projectile.anims.play('player_projectile');
        
        // Détruire les projectiles sortis de l'écran
        this.m_scene.physics.add.overlap(v_projectile, this.m_boundsTriggerPlayerProjectile, () => {
            this.m_projectiles.remove(v_projectile, true, true);
        });
    }
    
    /**
    * Ajoute une gestion de collision entre les projectiles et un ennemi.
    * @param {Phaser.GameObjects.GameObject} p_enemy - L'ennemi à vérifier pour les collisions.
    */
    addEnemyCollision(p_enemy) {
        this.m_projectiles.getChildren().forEach((v_projectile) => {
            this.m_scene.physics.add.overlap(v_projectile, p_enemy, () => {
                if (p_enemy.takeDamage) {
                    p_enemy.takeDamage(1);
                }
                this.m_projectiles.remove(v_projectile, true, true);
            });
        });
    }
}