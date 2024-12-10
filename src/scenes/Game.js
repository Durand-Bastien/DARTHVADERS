import { Scene } from 'phaser';
import Player from '../classes/player.js'
import Enemy from '../classes/enemy.js';
import EnemySquad from '../classes/enemySquad.js';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.player;
        this.enemy;
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
    
    preload () {
        this.load.spritesheet('explosion', 'assets/explosion.png', {
            frameWidth: 612,  // Largeur d'une frame
            frameHeight: 612  // Hauteur d'une frame
        });
        this.load.spritesheet('healthbar', 'assets/healthbar.png', {
            frameWidth: 1784,  // Largeur d'une frame
            frameHeight: 57  // Hauteur d'une frame
        });
    }
    
    create ()
    {
        this.anims.create({
            key: 'explosion', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 4 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        this.anims.create({
            key: 'player_idle', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player', 5, 200);

        this.cameras.main.setBackgroundColor(0x00ff00);
        
        this.add.image(512, 384, 'background').setAlpha(0.5);
        
        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        
        this.input.once('pointerdown', () => {
            
            this.scene.start('GameOver');
            
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        
        this.lastShotTime = 0;
        /*this.input.keyboard.on("keydown-SPACE", () => {
            this.player.shoot()
          });*/
      
      this.anims.create({
            key: 'enemy_idle', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        this.enemySquad = new EnemySquad(this, this.scale.width * 0.5, this.scale.height * 0.1, 10, 'triangle-down', this.player);
        this.enemySquad.checkShape();
    }

    update(time) {
        this.player.move(this.cursors);
        this.enemySquad.move(time);
      
        // Tir automatique toutes les 250 ms
        if (!this.lastShotTime) {
            this.lastShotTime = 0;
        }

        if (time > this.lastShotTime + 250) { // Intervalle de 250ms pour le tir
            this.player.shoot();
            this.lastShotTime = time;
        }
    }
}
