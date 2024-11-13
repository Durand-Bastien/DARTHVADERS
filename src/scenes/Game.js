import { Scene } from 'phaser';
import Player from '../classes/player.js'

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.player;
    }

    preload () 
    {
        this.load.spritesheet('enemy', 'assets/enemy1.png', {
            frameWidth: 60,  // Largeur d'une frame
            frameHeight: 106  // Hauteur d'une frame
        });  
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 82,  // Largeur d'une frame
            frameHeight: 120  // Hauteur d'une frame
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
    }

    update() {
        this.player.move(this.cursors);
    }
}
