import Enemy from './enemy.js';

/**
* Classe EnemySquad.
* Représente un groupe d'ennemis disposés dans différentes formations.
*/
export default class EnemySquad extends Phaser.Physics.Arcade.Sprite {
    /**
    * Constructeur du groupe d'ennemis.
    * Initialise les propriétés et configure la formation.
    * @param {Phaser.Scene} p_scene - La scène où le groupe est ajouté.
    * @param {number} p_x - Position X initiale du groupe.
    * @param {number} p_y - Position Y initiale du groupe.
    * @param {number} p_size - Nombre d'ennemis dans le groupe.
    * @param {string} p_shape - Forme de la formation (ex. 'line', 'triangle-down').
    * @param {Object} p_target - Cible du groupe (joueur).
    * @param {number} p_speed - Vitesse des ennemis.
    */
    constructor(p_scene, p_x, p_y, p_size, p_shape, p_target, p_speed = 60) {
        super(p_scene, p_x, p_y);
        
        // Vérification de la scène
        if (!p_scene) {
            console.error("La scène est indéfinie dans le constructeur EnemySquad !");
            return;
        }
        
        // Initialisation des propriétés
        this.m_scene = p_scene;
        this.m_speed = p_speed;
        this.m_enemies = {}; // Liste des ennemis
        this.m_size = p_size; // Taille du groupe
        this.m_shape = p_shape; // Forme de la formation
        this.m_spacing = 75; // Espacement entre les ennemis
        this.m_target = p_target; // Cible des ennemis
    }
    
    /**
    * Vérifie et applique la forme de la formation.
    */
    checkShape() {
        switch (this.m_shape) {
            case 'line':
            this.lineShape();
            break;
            case 'triangle-down':
            this.triangleDownShape();
            break;
            default:
            console.warn("Forme non reconnue :", this.m_shape);
            break;
        }
    }
    
    /**
    * Dispose les ennemis en ligne.
    */
    lineShape() {
        this.x = this.x - (this.m_size * (60 + this.m_spacing) / 2); // Ajuste la position de départ pour centrer la ligne
        
        for (let v_i = 0; v_i < this.m_size; v_i++) {
            const v_id = `enemy${v_i}`;
            this.m_enemies[v_id] = new Enemy(this.m_scene, this.x, this.y, 'enemy', 2, this.m_target);
            this.x += 60 + this.m_spacing; // Espacement entre les ennemis
        }
    }
    
    /**
    * Dispose les ennemis en formation triangulaire inversée.
    */
    triangleDownShape() {
        const v_startX = this.x; // Position initiale X
        const v_startY = this.y; // Position initiale Y
        let v_enemiesPlaced = 0; // Compteur pour les ennemis placés
        let v_row = 1;           // Commence avec une rangée de 1 ennemi
        
        while (v_enemiesPlaced < this.m_size) {
            const v_offsetX = (v_row - 1) * this.m_spacing / 2; // Décalage horizontal pour centrer la rangée
            
            for (let v_i = 0; v_i < v_row; v_i++) {
                if (v_enemiesPlaced < this.m_size) {
                    const v_id = `enemy${v_enemiesPlaced}`;
                    this.m_enemies[v_id] = new Enemy(
                        this.m_scene,
                        this.x - v_offsetX + (v_i * (60 + this.m_spacing)),
                        this.y,
                        'enemy',
                        2,
                        this.m_target
                    );
                    v_enemiesPlaced++;
                }
            }
            
            // Réinitialiser les positions pour la rangée suivante
            this.x = v_startX;
            this.y += 106; // Avance la position Y vers le bas
            v_row++;       // Augmente le nombre d'ennemis par rangée
        }
    }
    
    /**
    * Gère le déplacement et la mise à jour des ennemis dans le groupe.
    * Supprime les ennemis détruits.
    * @param {number} time - Temps courant en millisecondes.
    */
    move(time) {
        for (const v_key in this.m_enemies) {
            const v_enemy = this.m_enemies[v_key];
            
            if (v_enemy.active) {
                v_enemy.update(time);
            } else {
                v_enemy.removeAllListeners();
                delete this.m_enemies[v_key]; // Supprime l'ennemi du groupe
            }
        }
    }
}