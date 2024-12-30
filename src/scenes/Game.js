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
        this.cursors = null;
        this.lastShotTime = 0; // Initialiser le temps de tir
        this.enemiesSquad = [];
        this.squadCount = 0;
        this.enemyProjectiles;
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
        this.load.image('background', 'assets/background_game.jpg');
    }
  
    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
        .setOrigin(0.5) // Centre l'image
        .setDisplaySize(this.scale.width, this.scale.height); // Ajuste la taille à celle de l'écran
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 3 }),
            frameRate: 9,
            repeat: -1
        });
        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player');
        
        this.cameras.main.setBackgroundColor(0x00ff00);
        
        this.cursors = this.input.keyboard.createCursorKeys();
      
        //Timer du dernier spawn des enemies
        this.lastSpawn = 0;
        //Difficultés
        this.difficulty = 1;

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
        this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player', 5, 400);

        // Ajouter des ennemis (si EnemySquad est utilisé)
        this.enemySquad = new EnemySquad(this, this.scale.width * 0.5, this.scale.height * 0.2, 10, 'triangle-down', this.player);

        // Définir la couleur de fond
        this.cameras.main.setBackgroundColor(0x000000);

        // Configurer les touches du clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        // Créer l'ennemi une seule fois
        this.enemy = new Enemy(this, this.scale.width * 0.5, this.scale.height * 0.1, 'enemy', 4, this.player);
        this.enemyProjectiles = this.physics.add.group();
    }
    
    update(time) {
        this.player.move(this.cursors);

        this.enemiesSquad.forEach((squad, index) => { 
            squad.move(time)

            if (Object.keys(squad.enemies).length === 0) {
                console.log(`Squad ${squad.id} supprimée car vide.`);

                // Nettoyer la squad (sprites, groupes, etc.)
                squad.destroy();

                // Supprimer la squad du tableau
                this.enemiesSquad.splice(index, 1);
            }

            Object.entries(squad.enemies).forEach(([id, enemy]) => {
                this.player.addEnemyCollision(enemy);
            });
        });

        if(!this.lastSpawn) this.lastSpawn = 0;

        if(time > this.lastSpawn + 5000) {
            //random shape
            this.shape = Math.random() > 0.5 ? 'triangle-down' : 'line';
            this.number = Math.random() * 10
            this.newEnemySquad = new EnemySquad(this, this.scale.width * (Math.random()),this.scale.height * 0.1, this.number, this.shape, this.player)
            this.newEnemySquad.checkShape();
            this.enemiesSquad.push(this.newEnemySquad);
            this.lastSpawn = time;

            console.log(this.enemiesSquad)
        }
        // Tir automatique toutes les 250 ms
        if (!this.lastShotTime) {
            this.lastShotTime = 0;
        }

        // Gérer le tir automatique
        if (time > this.lastShotTime + 250) { // Intervalle de 250 ms
            if (this.player) {
                this.player.shoot();
            }
            this.lastShotTime = time;
        }

        this.enemyProjectiles.getChildren().forEach(projectile => {
            if (!projectile.active) {
                // Retirer le projectile du groupe et le supprimer totalement
                this.scene.enemyProjectiles.remove(projectile, true, true); // true pour détruire et retirer
                console.log(this.enemyProjectiles)
                console.log(this.projectiles)
            }
        });
    }
}
