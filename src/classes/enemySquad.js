import Enemy from "./enemy";

/**
* Classe EnemySquad.
* Représente un groupe d'ennemis disposés dans différentes formations.
*/
export default class EnemySquad extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur du groupe d'ennemis.
    * Initialise les propriétés et configure la formation.
    * @param {Phaser.Scene} scene - La scène où le groupe est ajouté.
    * @param {number} x - Position X initiale du groupe.
    * @param {number} y - Position Y initiale du groupe.
    * @param {number} size - Nombre d'ennemis dans le groupe.
    * @param {string} shape - Forme de la formation (ex. 'line', 'triangle-down').
    * @param {Object} target - Cible du groupe (joueur).
    * @param {number} speed - Vitesse des ennemis.
    */
    constructor(scene, x, y, size, shape, target, speed = 60) {
        super(scene, x, y);
        
        // Vérification de la scène
        if (!scene) {
            console.error("La scène est indéfinie dans le constructeur EnemySquad !");
            return;
        }
        
        // Initialisation des propriétés
        this.scene = scene;
        this.speed = speed;
        this.enemies = {}; // Liste des ennemis
        this.size = size; // Taille du groupe
        this.shape = shape; // Forme de la formation
        this.spacing = 75; // Espacement entre les ennemis
        this.target = target; // Cible des ennemis
    }
    
    /**
    * Vérifie et applique la forme de la formation.
    */
    checkShape() {
        switch (this.shape) {
            case 'line':
            this.lineShape();
            break;
            case 'triangle-down':
            this.triangleDownShape();
            break;
            default:
            console.warn("Forme non reconnue :", this.shape);
            break;
        }
    }
    
    /**
    * Dispose les ennemis en ligne.
    */
    lineShape() {
        this.x = this.x - (this.size * (60 + this.spacing) / 2); // Ajuste la position de départ pour centrer la ligne
        
        for (let i = 0; i < this.size; i++) {
            const id = `enemy${i}`;
            this.enemies[id] = new Enemy(this.scene, this.x, this.y, 'enemy', 2, this.target);
            this.x += 60 + this.spacing; // Espacement entre les ennemis
        }
    }
    
    /**
    * Dispose les ennemis en formation triangulaire inversée.
    */
    triangleDownShape() {
        const startX = this.x; // Position initiale X
        const startY = this.y; // Position initiale Y
        let enemiesPlaced = 0; // Compteur pour les ennemis placés
        let row = 1; // Commence avec une rangée de 1 ennemi
        
        while (enemiesPlaced < this.size) {
            const offsetX = (row - 1) * this.spacing / 2; // Décalage horizontal pour centrer la rangée
            
            for (let i = 0; i < row; i++) {
                if (enemiesPlaced < this.size) {
                    const id = `enemy${enemiesPlaced}`;
                    this.enemies[id] = new Enemy(this.scene, this.x - offsetX + (i * (60 + this.spacing)), this.y, 'enemy', 2, this.target);
                    enemiesPlaced++;
                }
            }
            
            // Réinitialiser les positions pour la rangée suivante
            this.x = startX;
            this.y += 106; // Avance la position Y vers le bas
            row++; // Augmente le nombre d'ennemis par rangée
        }
    }
    
    /**
    * Gère le déplacement et la mise à jour des ennemis dans le groupe.
    * Supprime les ennemis détruits.
    * @param {number} time - Temps courant en millisecondes.
    */
    move(time) {
        for (const key in this.enemies) {
            const enemy = this.enemies[key];
            
            if (enemy.active) {
                enemy.update(time);
            } else {
                enemy.removeAllListeners();
                delete this.enemies[key]; // Supprime l'ennemi du groupe
            }
        }
    }
}