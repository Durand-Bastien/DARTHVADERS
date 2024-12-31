/**
* Classe Enemy.
* Représente un ennemi dans le jeu, capable de se déplacer et de tirer des projectiles.
*/
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur de l'ennemi.
    * Initialise les propriétés de l'ennemi et le configure dans la scène.
    * @param {Phaser.Scene} p_scene - La scène où l'ennemi est ajouté.
    * @param {number} p_x - Position initiale en X.
    * @param {number} p_y - Position initiale en Y.
    * @param {string} p_texture - Texture de l'ennemi.
    * @param {number} p_hp - Points de vie de l'ennemi.
    * @param {Object} p_target - La cible (joueur) de l'ennemi.
    * @param {number} p_speed - Vitesse de déplacement de l'ennemi.
    */
    constructor(p_scene, p_x, p_y, p_texture, p_hp, p_target, p_speed = 60) {
        super(p_scene, p_x, p_y, p_texture);
        
        // Vérification de la scène
        if (!p_scene) {
            console.error('La scène est indéfinie dans le constructeur Enemy !');
            return;
        }
        
        // Initialisation des propriétés
        this.m_scene = p_scene;
        this.m_speed = p_speed;
        this.m_maxHp = p_hp;
        this.m_currentHp = p_hp;
        this.m_isAlive = true;
        this.m_target = p_target;
        this.m_lastShotTime = 0; // Nécessaire pour le tir automatique
        
        // Zone pour détecter les projectiles hors des limites
        this.m_boundsTrigger = this.m_scene.add
        .zone(
            -this.m_scene.scale.width,
            this.m_scene.scale.height + 150,
            this.m_scene.scale.width * 3,
            10
        )
        .setOrigin(0)
        .setDepth(-1); // Zone invisible
        
        this.m_scene.physics.add.existing(this.m_boundsTrigger, true);
        
        // Vérifier si l'animation des projectiles ennemis existe
        if (!this.m_scene.anims.exists('enemy_projectile')) {
            this.m_scene.anims.create({
                key: 'enemy_projectile',
                frames: this.anims.generateFrameNumbers('enemy_projectile', {
                    start: 0,
                    end: 2
                }),
                frameRate: 8
            });
        }
        
        // Ajouter l'ennemi à la scène
        this.m_scene.add.existing(this);
        this.m_scene.physics.add.existing(this);
        
        // Jouer l'animation idle par défaut
        this.play('enemy_idle');
    }
    
    /**
    * Déplacement de l'ennemi.
    * Définit la vélocité verticale de l'ennemi.
    */
    move() {
        if (this.m_isAlive) {
            this.setVelocityY(this.m_speed);
        }
    }
    
    /**
    * Tirer un projectile.
    * L'ennemi tire un projectile vers le bas en direction de la cible.
    * @param {number} p_projectileSpeed - Vitesse du projectile.
    */
    shootProjectile(p_projectileSpeed = 300) {
        // Vérifie que le groupe de projectiles ennemis existe
        if (!this.m_scene.m_enemyProjectiles) {
            console.warn('m_enemyProjectiles est inexistant dans la scène.');
            return;
        }
        
        const v_projectile = this.m_scene.m_enemyProjectiles.create(
            this.x,
            this.y + this.height / 2,
            'enemy_projectile'
        );
        
        v_projectile.setSize(13, 58).setOffset(0, 0).setFlipY(true);
        
        // Déplacement du projectile
        this.m_scene.physics.moveTo(
            v_projectile,
            this.x,
            this.y + 500,
            p_projectileSpeed
        );
        
        // Jouer l'animation du projectile
        v_projectile.anims.play('enemy_projectile');
        
        // Gérer la collision avec la cible
        this.m_scene.physics.add.overlap(v_projectile, this.m_target, () => {
            if (this.m_target.takeDamage) {
                this.m_target.takeDamage(1);
            }
            v_projectile.destroy();
        });
        
        // Détruire les projectiles hors des limites
        this.m_scene.physics.add.overlap(v_projectile, this.m_boundsTrigger, () => {
            v_projectile.destroy();
        });
    }
    
    /**
    * Gestion des dégâts reçus par l'ennemi.
    * Réduit la santé et détruit l'ennemi si ses points de vie atteignent 0.
    */
    takeDamage() {
        this.m_currentHp--;
        
        if (this.m_currentHp <= 0) {
            this.anims.play('explosion');
            this.m_scene.time.delayedCall(1000 / 6, () => {
                this.m_isAlive = false;
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
        if (!this.m_isAlive) {
            return;
        }
        
        this.move();
        
        // Tir automatique toutes les 2000 ms
        if (time > this.m_lastShotTime + 2000) {
            this.shootProjectile();
            this.m_lastShotTime = time;
        }
        
        // Détruire l'ennemi hors des limites
        this.m_scene.physics.add.overlap(this, this.m_boundsTrigger, () => {
            this.m_isAlive = false;
            this.destroy();
        });
    }
}