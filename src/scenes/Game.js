import { Scene } from 'phaser';
import Player from '../classes/player.js'
import Enemy from '../classes/enemy.js';
import HealthBar from '../classes/healthbar.js';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.player;
        this.enemy;
        this.healthBar;
    }

    preload () 
    {
        this.load.spritesheet('enemy', 'assets/enemy1.png', {
            frameWidth: 60,  // Largeur d'une frame
            frameHeight: 106  // Hauteur d'une frame
        });    
        this.load.spritesheet('enemy_projectile', 'assets/enemy_projectile.png', {
            frameWidth: 13,
            frameHeight: 58
        });
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 82,  // Largeur d'une frame
            frameHeight: 120  // Hauteur d'une frame
        });   
        this.load.spritesheet('player_projectile', 'assets/player_projectile.png', {
            frameWidth: 13,  // Largeur d'une frame
            frameHeight: 58  // Hauteur d'une frame
        });
    }

    create ()
    {
        this.anims.create({
            key: 'player_idle', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player');

        this.cameras.main.setBackgroundColor(0x00ff00);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'enemy_idle', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('enemy', { start: 1, end: 3 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        // Créer l'ennemi une seule fois
        this.enemy = new Enemy(this, this.scale.width * 0.5, this.scale.height * 0.1, 'enemy', 4, this.player);

        this.healthBar = new HealthBar(this, this.scale.width * 0.5, this.scale.height * 0.95);

        // Raccourci pour tester la perte de vie
        this.input.keyboard.on('keydown-T', () => {
            if (this.healthBar) {
                this.healthBar.takeDamage();
            }
        });
    }

    update(time) {
        this.player.move(this.cursors);
        this.enemy.update(time);

        // Test des degats
        if (Phaser.Input.Keyboard.JustDown(this.testKey)) {
            this.HealthBar.takeDamage();
        }
    }
}
