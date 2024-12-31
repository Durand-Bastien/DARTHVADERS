import { Scene } from 'phaser';
import Player from '../classes/player.js';
import EnemySquad from '../classes/enemySquad.js';

/**
* Scène principale du jeu.
* Gère le joueur, les ennemis, les projectiles et la logique principale.
*/
export class Game extends Scene {
    /**
    * Constructeur de la scène Game.
    */
    constructor() {
        super('Game'); // Identifiant unique de la scène
        
        // Initialisation des variables globales
        this.m_player = null;
        this.m_enemy = null;
        this.m_healthBar = null;
        this.m_cursors = null;
        this.m_lastShotTime = 0;
        this.m_enemiesSquad = [];
        this.m_squadCount = 0;
        this.m_enemyProjectiles = null;
        this.m_lastSpawn = 0;
        this.m_difficulty = 1;
    }
    
    /**
    * Préchargement des ressources nécessaires à la scène.
    */
    preload() {
        // Charger les spritesheets et images
        this.load.spritesheet('enemy', 'assets/enemy1.png', {
            frameWidth: 60,
            frameHeight: 106
        });
        this.load.spritesheet('enemy_projectile', 'assets/enemy_projectile.png', {
            frameWidth: 13,
            frameHeight: 58
        });
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 82,
            frameHeight: 120
        });
        this.load.spritesheet('player_projectile', 'assets/player_projectile.png', {
            frameWidth: 13,
            frameHeight: 58
        });
        this.load.spritesheet('explosion', 'assets/explosion.png', {
            frameWidth: 612,
            frameHeight: 612
        });
        this.load.spritesheet('healthbar', 'assets/healthbar.png', {
            frameWidth: 446,
            frameHeight: 57
        });
        this.load.image('background', 'assets/background_game.jpg');
    }
    
    /**
    * Création de la scène.
    * Initialise les éléments principaux comme le joueur, les ennemis, les animations et les contrôles.
    */
    create() {
        // Ajouter le fond d'écran et l'ajuster à la taille de l'écran
        this.add
        .image(this.scale.width / 2, this.scale.height / 2, 'background')
        .setOrigin(0.5)
        .setDisplaySize(this.scale.width, this.scale.height);
        
        // Créer les animations pour les sprites
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 9,
            repeat: -1
        });
        
        this.anims.create({
            key: 'enemy_idle',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
            frameRate: 9,
            repeat: -1
        });
        
        // Créer le joueur
        this.m_player = new Player(
            this,
            this.scale.width * 0.5,
            this.scale.height * 0.9,
            'player',
            400
        );
        
        // Créer une première squad d'ennemis
        this.m_enemySquad = new EnemySquad(
            this,
            this.scale.width * 0.5,
            this.scale.height * 0.2,
            10,
            'triangle-down',
            this.m_player
        );
        
        // Créer un groupe pour les projectiles ennemis
        this.m_enemyProjectiles = this.physics.add.group();
        
        // Configurer les touches du clavier
        this.m_cursors = this.input.keyboard.createCursorKeys();
    }
    
    /**
    * Mise à jour de la scène.
    * Gère les mouvements, les collisions, le tir automatique, et la génération d'ennemis.
    * @param {number} time - Temps courant en millisecondes.
    */
    update(time) {
        // Déplacement du joueur
        this.m_player.move(this.m_cursors);
        
        // Gérer les squads d'ennemis
        this.m_enemiesSquad.forEach((v_squad, v_index) => {
            v_squad.move(time);
            
            // Supprimer les squads vides
            if (Object.keys(v_squad.m_enemies).length === 0) {
                v_squad.destroy();
                this.m_enemiesSquad.splice(v_index, 1);
            }
            
            // Gérer les collisions entre le joueur et les ennemis
            Object.entries(v_squad.m_enemies).forEach(([v_id, v_enemy]) => {
                this.m_player.addEnemyCollision(v_enemy);
            });
        });
        
        // Générer de nouvelles squads toutes les 5 secondes
        if (time > this.m_lastSpawn + 5000) {
            const v_shape = Math.random() > 0.5 ? 'triangle-down' : 'line';
            const v_number = Math.random() * 10;
            const v_newSquad = new EnemySquad(
                this,
                this.scale.width * Math.random(),
                this.scale.height * 0.1,
                v_number,
                v_shape,
                this.m_player
            );
            
            v_newSquad.checkShape();
            this.m_enemiesSquad.push(v_newSquad);
            this.m_lastSpawn = time;
        }
        
        // Gestion du tir automatique
        if (time > this.m_lastShotTime + 250) {
            this.m_player.shoot();
            this.m_lastShotTime = time;
        }
        
        // Nettoyer les projectiles inactifs
        this.m_enemyProjectiles.getChildren().forEach((v_projectile) => {
            if (!v_projectile.active) {
                this.m_enemyProjectiles.remove(v_projectile, true, true);
            }
        });
    }
}