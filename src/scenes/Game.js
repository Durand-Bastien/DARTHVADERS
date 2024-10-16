import { Scene } from 'phaser';
import Player from '../classes/player.js'
import Enemy from '../classes/enemy.js';

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
        this.load.image('player', '../../public/assets/player.png')
        this.load.spritesheet('enemy', 'assets/enemy1.png', {
            frameWidth: 60,  // Largeur d'une frame
            frameHeight: 106  // Hauteur d'une frame
        });    
    }

    create ()
    {
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
        this.enemy = new Enemy(this, this.scale.width * 0.5, this.scale.height * 0.1, 'enemy');
    }

    update() {
        this.player.move(this.cursors);
    }
}
