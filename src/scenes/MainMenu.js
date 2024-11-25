import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor () {
        super('MainMenu');
    }

    create () {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 120, 'logo')
            .setOrigin(0.5);

        const playText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 50, 'Jouer', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Rendre le texte interactif
        playText.setInteractive({ useHandCursor: true });

        // Effet "hover" (souris au-dessus)
        playText.on('pointerover', () => {
            playText.setStyle({ color: '#FFE81F' }); // Change la couleur en rouge
        });

        // Effet "hover out" (souris quitte)
        playText.on('pointerout', () => {
            playText.setStyle({ color: '#ffffff' }); // Reviens à la couleur blanche
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
