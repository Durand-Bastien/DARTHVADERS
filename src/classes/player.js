export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, maxHp=100, speed=160, currentWeapon='default') 
    {
        // Appelle le constructeur parent
        super(scene, x, y, texture);

        // Ajoute le joueur à la scène et lui assigne un corps physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        

        // Définit des propriétés du joueur
        this.speed = speed;      // Vitesse de déplacement
        this.maxHp = maxHp;      // Points de vie max du joueur 
        this.currentHp = maxHp;  // Points de vie actuels du joueur
        this.isAlive = true;     // Indique si le joueur est vivant
        this.currentWeapon = currentWeapon;
        this.projectiles = scene.physics.add.group();
        this.lastFiredLeft = true;
        this.target;
        
        // Configuration du corps physique du joueur
        this.setCollideWorldBounds(true);  // Le joueur ne sort pas des limites du monde

        // Jouer l'animation 'player_idle'
        this.play('player_idle');
    }

    move(cursors)
    {
        if(this.isAlive)
        {
            // Réinitialiser la vélocité du joueur
            this.setVelocity(0);

            // Vérifier les touches enfoncées
            if (cursors.left.isDown) {
                this.setVelocityX(-this.speed);  // Déplace vers la gauche
            }
            else if (cursors.right.isDown) {
                this.setVelocityX(this.speed);   // Déplace vers la droite
            }
        }
        
    }

    // Méthode pour recevoir des dégâts
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.isAlive = false;
            this.die();
        }
    }

    // Méthode appelée lorsque le joueur meurt
    die() {
        this.setTint(0xff0000);  // Change la couleur du sprite
        this.setVelocity(0, 0);  // Arrête le joueur
        // Autres actions à effectuer à la mort, comme jouer une animation ou changer de scène
    }

    // Méthode pour tirer un projectile
    shoot(projectileSpeed = 300) {
        const centerX = this.x+(this.width/2)
        var projectile = null;
        if(!this.lastFiredLeft) {
            projectile = this.projectiles.create(centerX+(this.width/2), this.y+5, 'projectileTexture'); // Sprite pour le projectile
            this.scene.physics.moveTo(projectile, centerX+(this.width/2), this.y-500, projectileSpeed); 
            this.lastFiredLeft = !this.lastFiredLeft
        }
        else {
            projectile = this.projectiles.create(centerX-(this.width/2), this.y+5, 'projectileTexture'); // Sprite pour le projectile
            this.scene.physics.moveTo(projectile, centerX-(this.width/2), this.y-500, projectileSpeed);
            this.lastFiredLeft = !this.lastFiredLeft 
        }
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
    
        // Détruire le projectile après un délai s'il ne touche rien
        this.scene.time.delayedCall(1750, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }
}