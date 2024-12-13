import Enemy from "./enemy";

export default class EnemySquad extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, size, shape, target, speed=60) {
        super(scene, x, y);

        this.scene = scene;
        this.speed = speed;
        this.enemiesSprites = scene.physics.add.group();
        this.enemies = {}
        this.size = size;
        this.shape = shape;
        this.spacing = 150/2
        this.target = target

        if (!scene) {
            console.error("La scène est indéfinie dans le constructeur enemySquad !");
        }
    }

    checkShape() {
        switch(this.shape) {
            case 'line':
                this.lineShape();
                break;
            case 'triangle-down':
                this.triangleDownShape();
            default:
                break;
        }
    }

    lineShape() {
        this.x = this.x - (this.size * (60 + this.spacing)/2)
        for(var i = 0; i < this.size; i++) {
            var id = "enemy"+i;
            this.enemies[id] = new Enemy(this.scene, this.x, this.y, 'enemy', 2, this.target)
            this.x += 60 + this.spacing;
        }
    }

    triangleDownShape() {
        let startX = this.x; // Position initiale en X
        let startY = this.y; // Position initiale en Y
        let enemiesPlaced = 0; // Compteur pour les ennemis placés
        let row = 1; // Commencer avec 1 ennemi dans la première rangée
    
        while (enemiesPlaced < this.size) {
            // Calculer l'offset pour centrer la rangée
            let offsetX = (row - 1) * this.spacing; // Décalage horizontal pour centrer la rangée
    
            // Placer les ennemis dans la rangée
            for (let i = 0; i < row; i++) {
                if (enemiesPlaced < this.size) {
                    let id = "enemy" + enemiesPlaced;
                    this.enemies[id] = new Enemy(this.scene, this.x - offsetX, this.y, 'enemy', 4, this.target);
                    this.x += 60 + this.spacing/2; // Espacement horizontal entre les ennemis
                    enemiesPlaced++; // Incrémenter le nombre d'ennemis placés
                }
            }
    
            // Réinitialiser la position X pour la prochaine rangée et avancer la position Y
            this.x = startX; // Retourner à la position initiale pour la prochaine rangée
            this.y -= 106; // Avance la position de Y vers le haut
    
            row++; // Augmenter le nombre d'ennemis pour la prochaine rangée
        }
    }
    

    move(time) {
        for (const key in this.enemies) {
            this.enemies[key].update(time);
        }
    }
}