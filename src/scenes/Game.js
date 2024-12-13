import { Scene } from 'phaser';
import Player from '../classes/player.js';
import Enemy from '../classes/enemy.js';
import EnemySquad from '../classes/enemySquad.js'; // Supposons que EnemySquad est utilisé

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.enemy = null;
        this.healthBar = null;
        this.enemySquad = null;
        this.cursors = null;
        this.lastShotTime = 0; // Initialiser le temps de tir
    }

    preload() {
        // Charger les spritesheets
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
    }

    create() {
        // Vérifier si les assets sont chargés
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 3 }),
            frameRate: 9,
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

        // Ajouter le joueur au centre inférieur de l'écran
        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player', 5, 200);

        // Ajouter des ennemis (si EnemySquad est utilisé)
        this.enemySquad = new EnemySquad(this, this.scale.width * 0.5, this.scale.height * 0.2, 10, 'triangle-down', this.player);

        // Définir la couleur de fond
        this.cameras.main.setBackgroundColor(0x000000);

        // Configurer les touches du clavier
        this.cursors = this.input.keyboard.createCursorKeys();

        // Créer l'ennemi une seule fois
        this.enemy = new Enemy(this, this.scale.width * 0.5, this.scale.height * 0.1, 'enemy', 4, this.player);

        // Raccourci pour tester la perte de vie
        this.input.keyboard.on('keydown-T', () => {
            if (this.player.healthBar) {
                this.player.takeDamage();
            }
        });
    }

    update(time) {
        // Déplacer le joueur
        if (this.player) {
            this.player.move(this.cursors);
        }

        // Déplacer les ennemis
        if (this.enemySquad) {
            this.enemySquad.move(time);
        }

        // Gérer le tir automatique
        if (time > this.lastShotTime + 250) { // Intervalle de 250 ms
            if (this.player) {
                this.player.shoot();
            }
            this.lastShotTime = time;
        }
    }
}
