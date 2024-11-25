import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }
    
    preload () {
        this.load.spritesheet('explosion', 'assets/explosion.png', {
            frameWidth: 612,  // Largeur d'une frame
            frameHeight: 612  // Hauteur d'une frame
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
    }
}
