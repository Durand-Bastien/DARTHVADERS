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
        
        // Initialisation des variables
        this.player = null;
        this.enemy = null;
        this.healthBar = null;
        this.cursors = null;
        this.lastShotTime = 0;
        this.enemiesSquad = [];
        this.squadCount = 0;
        this.enemyProjectiles = null;
    }
    
    /**
    * Préchargement des ressources nécessaires à la scène.
    */
    preload() {
        // Charger les spritesheets et images
        this.load.spritesheet('enemy', 'assets/enemy1.png', { frameWidth: 60, frameHeight: 106 });
        this.load.spritesheet('enemy_projectile', 'assets/enemy_projectile.png', { frameWidth: 13, frameHeight: 58 });
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 82, frameHeight: 120 });
        this.load.spritesheet('player_projectile', 'assets/player_projectile.png', { frameWidth: 13, frameHeight: 58 });
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 612, frameHeight: 612 });
        this.load.spritesheet('healthbar', 'assets/healthbar.png', { frameWidth: 446, frameHeight: 57 });
        this.load.image('background', 'assets/background_game.jpg');
    }
    
    /**
    * Création de la scène.
    * Initialise les éléments principaux comme le joueur, les ennemis, les animations et les contrôles.
    */
    create() {
        // Ajouter le fond d'écran et l'ajuster à la taille de l'écran
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
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
        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player', 400);
        
        // Créer une première squad d'ennemis
        this.enemySquad = new EnemySquad(this, this.scale.width * 0.5, this.scale.height * 0.2, 10, 'triangle-down', this.player);
        
        // Créer un groupe pour les projectiles ennemis
        this.enemyProjectiles = this.physics.add.group();
        
        // Configurer les touches du clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Initialiser le temps du dernier spawn
        this.lastSpawn = 0;
        
        // Définir la difficulté initiale
        this.difficulty = 1;
    }
    
    /**
    * Mise à jour de la scène.
    * Gère les mouvements, les collisions, le tir automatique, et la génération d'ennemis.
    * @param {number} time - Temps courant en millisecondes.
    */
    update(time) {
        // Déplacement du joueur
        this.player.move(this.cursors);
        
        // Gérer les squads d'ennemis
        this.enemiesSquad.forEach((squad, index) => {
            squad.move(time);
            
            // Supprimer les squads vides
            if (Object.keys(squad.enemies).length === 0) {
                squad.destroy();
                this.enemiesSquad.splice(index, 1);
            }
            
            // Gérer les collisions entre le joueur et les ennemis
            Object.entries(squad.enemies).forEach(([id, enemy]) => {
                this.player.addEnemyCollision(enemy);
            });
        });
        
        // Générer de nouvelles squads toutes les 5 secondes
        if (time > this.lastSpawn + 5000) {
            const shape = Math.random() > 0.5 ? 'triangle-down' : 'line';
            const number = Math.random() * 10;
            const newSquad = new EnemySquad(this, this.scale.width * Math.random(), this.scale.height * 0.1, number, shape, this.player);
            
            newSquad.checkShape();
            this.enemiesSquad.push(newSquad);
            this.lastSpawn = time;
        }
        
        // Gestion du tir automatique
        if (time > this.lastShotTime + 250) {
            this.player.shoot();
            this.lastShotTime = time;
        }
        
        // Nettoyer les projectiles inactifs
        this.enemyProjectiles.getChildren().forEach(projectile => {
            if (!projectile.active) {
                this.enemyProjectiles.remove(projectile, true, true);
            }
        });
    }
}