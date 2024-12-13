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
        this.enemiesSquad = [];
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
        //Timer du dernier spawn des enemies
        this.lastSpawn = 0;
        //Difficultés
        this.difficulty = 1;


        this.anims.create({
            key: 'player_idle', // Le nom de l'animation
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), // Frames de l'animation
            frameRate: 9, // Vitesse de l'animation
            repeat: -1 // Répéter l'animation en boucle
        });

        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player', 5, 400);

        this.cameras.main.setBackgroundColor(0x00ff00);

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
    }

    update(time) {
        this.player.move(this.cursors);
        this.enemiesSquad.forEach(element => { element.move(time)
            
        });;

        if(!this.lastSpawn) this.lastSpawn = 0;

        if(time > this.lastSpawn + 3000) {
            //random shape
            this.shape = Math.random() > 0.5 ? 'triangle-down' : 'line';
            this.number = Math.random() * 10
            this.newEnemySquad = new EnemySquad(this, this.scale.width * (Math.random()),this.scale.height * 0.1, this.number, this.shape, this.player)
            this.newEnemySquad.checkShape();
            this.enemiesSquad.push(this.newEnemySquad);
            this.lastSpawn = time;
        }
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
