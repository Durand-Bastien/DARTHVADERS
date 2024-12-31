import Enemy from '../src/classes/enemy';
import Phaser from 'phaser';

/**
* Tests unitaires pour la classe Enemy.
*/
describe('Enemy Class', () => {
    let scene;
    let enemy;
    let mockTarget;
    
    /**
    * Initialisation des ressources avant chaque test.
    */
    beforeEach(() => {
        // Mock de la cible avec une méthode `takeDamage`
        mockTarget = { takeDamage: jest.fn() };
        
        // Mock de la scène Phaser
        scene = {
            add: { existing: jest.fn() },
            physics: { add: { existing: jest.fn(), group: jest.fn(), overlap: jest.fn() } },
            scale: { width: 800, height: 600 },
            anims: { create: jest.fn(), generateFrameNumbers: jest.fn(), exists: jest.fn(() => false) },
            time: { delayedCall: jest.fn() },
        };
        
        // Création d'une instance de Enemy
        enemy = new Enemy(scene, 100, 100, 'enemyTexture', 5, mockTarget, 60);
    });
    
    /**
    * Vérifie l'initialisation correcte de l'ennemi.
    */
    test('Initialisation d\'un ennemi avec les bons attributs', () => {
        expect(enemy.speed).toBe(60); // Vitesse de l'ennemi
        expect(enemy.maxHp).toBe(5); // Points de vie maximum
        expect(enemy.currentHp).toBe(5); // Points de vie actuels
        expect(enemy.isAlive).toBe(true); // L'ennemi est initialement vivant
    });
    
    /**
    * Vérifie que l'ennemi prend des dégâts et meurt correctement.
    */
    test('Doit prendre des dégâts et mourir quand il atteint 0 HP', () => {
        // Réduction des points de vie
        enemy.currentHp = 1;
        
        // Appliquer des dégâts
        enemy.takeDamage();
        
        // Vérifier les points de vie et l'état de l'ennemi
        expect(enemy.currentHp).toBe(0); // Plus de points de vie
        expect(enemy.isAlive).toBe(false); // L'ennemi est mort
        
        // Vérifie que la destruction est planifiée
        expect(scene.time.delayedCall).toHaveBeenCalledWith(
            1000 / 6,
            expect.any(Function) // Une fonction est appelée pour la destruction
        );
    });
    
    /**
    * Vérifie que l'ennemi bouge dans le bon sens selon sa vélocité.
    */
    test('Doit bouger dans le bon sens suivant sa vélocité', () => {
        // Appeler la méthode de déplacement
        enemy.move();
        
        // Vérifier la vélocité
        expect(enemy.body.velocity.y).toBe(60); // Vélocité verticale correcte
    });
    
    /**
    * Vérifie que l'ennemi peut tirer un projectile vers la cible.
    */
    test('Doit tirer un projectile en direction de la cible', () => {
        // Tirer un projectile
        enemy.shootProjectile(300);
        
        // Vérifier que la collision entre le projectile et la cible est bien ajoutée
        expect(scene.physics.add.overlap).toHaveBeenCalledWith(
            expect.any(Object), // Le projectile
            mockTarget, // La cible
            expect.any(Function) // Fonction de collision
        );
    });
});