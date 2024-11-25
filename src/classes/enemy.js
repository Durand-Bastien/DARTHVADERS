export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp, target, speed=60) {
        super(scene, x, y, texture);

        this.speed = speed;
        this.projectiles = scene.physics.add.group();
        this.maxHp = hp;
        this.currentHp = hp;
        this.isAlive = true;
        this.target = target;

        this.boundsTrigger = this.scene.add.zone(0, this.scene.scale.height+150, this.scene.scale.width, 10)
            .setOrigin(0)
            .setDepth(-1); // Invisible
        this.scene.physics.add.existing(this.boundsTrigger, true);

        if(!this.scene.anims.exists('enemy_projectile')) {
            this.scene.anims.create({
                key: 'enemy_projectile', // Le nom de l'animation
                frames: this.anims.generateFrameNumbers('enemy_projectile', { start: 0, end: 2 }), // Frames de l'animation
                frameRate: 8, // Vitesse de l'animation
                //repeat: 0 // Répéter l'animation en boucle
            });
        }

        if (!scene) {
            console.error("La scène est indéfinie dans le constructeur Enemy !");
        }

        // Ajouter l'ennemi à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Jouer l'animation 'enemy_idle'
        this.play('enemy_idle');
    }

    move() {
        if(this.isAlive) {
            this.setVelocityY(this.speed);
        }
    }

    shootProjectile(projectileSpeed = 300) {
        //const centerX = this.x+(this.width/2)
        const projectile = this.projectiles.create(this.x, this.y + this.height/2, 'enemy_projectile'); // Sprite pour le projectile
        projectile.setSize(13, 58);
        projectile.setOffset(0, 0);
        projectile.setFlipY(true);
        this.scene.physics.moveTo(projectile, this.x, this.y+500, projectileSpeed);
        
        projectile.anims.play('enemy_projectile'); // Jouer l'animation 'enemy_projectile'
        
        // Vitesse du projectile
    
        // Gérer la collision avec chaque cible dans `this.targetList`
        this.scene.physics.add.collider(projectile, this.target, () => {
            // Actions lors de la collision avec la cible
            if (this.target.takeDamage) {
                this.target.takeDamage(1); // Inflige des dégâts si la cible a une méthode `takeDamage`
            }
            projectile.destroy(); // Détruit le projectile après avoir touché la cible
            console.log('cible touchée')
        });

        // Activer la destruction du projectile en cas de sortie des limites du monde
        this.scene.physics.add.overlap(projectile, this.boundsTrigger, (entity) => {
            entity.destroy();
            console.log("suppr projectile")
        });
    }

    update(time){
        if(this.isAlive){
                this.move();

            // Tir automatique toutes les 500 ms
            if (!this.lastShotTime) {
                this.lastShotTime = 0;
            }

            if (time > this.lastShotTime + 2000) { // Intervalle de 500ms pour le tir
                this.shootProjectile();
                this.lastShotTime = time;
            }


            this.scene.physics.add.overlap(this, this.boundsTrigger, (entity) => {
                this.isAlive = false;
                this.destroy();
                console.log("suppr enemy")
            });
        }
        
    }
}