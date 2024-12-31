import Player from '../src/classes/player';
import Phaser from 'phaser';

jest.mock('../src/classes/healthbar.js'); // Mock de la classe HealthBar

/**
* Tests unitaires pour la classe Player.
*/
describe('Player Class', () => {
    let scene;
    let player;
    
    /**
    * Initialisation des ressources avant chaque test.
    */
    beforeEach(() => {
        // Mock de la scène Phaser
        scene = {
            add: { existing: jest.fn() },
            physics: { add: { existing: jest.fn(), group: jest.fn() } },
            scale: { width: 800, height: 600 },
            anims: { create: jest.fn(), generateFrameNumbers: jest.fn() },
            time: { delayedCall: jest.fn() },
        };
        
        // Création d'une instance de Player
        player = new Player(scene, 100, 100, 'playerTexture', 160, 'default');
    });
    
    /**
    * Vérifie que le joueur est initialisé avec les bons attributs.
    */
    test('Initialisation du joueur avec les bons attributs', () => {
        expect(player.speed).toBe(160); // Vitesse initiale
        expect(player.isAlive).toBe(true); // Le joueur est vivant par défaut
        expect(player.currentWeapon).toBe('default'); // Arme par défaut
    });
    
    /**
    * Vérifie que le déplacement modifie correctement la vélocité.
    */
    test('Modification de la vélocité sur le move()', () => {
        const cursors = { left: { isDown: true }, right: { isDown: false } };
        
        // Appeler la méthode move()
        player.move(cursors);
        
        // Vérifier la vélocité
        expect(player.body.velocity.x).toBe(-160); // Mouvement à gauche
        expect(player.body.velocity.y).toBe(0); // Pas de mouvement vertical
    });
    
    /**
    * Vérifie que le joueur prend des dégâts et meurt correctement.
    */
    test('Prend des dégâts et meurt si sa vie atteint 0', () => {
        player.healthBar.health = 1; // Simuler une santé proche de zéro
        
        // Appliquer des dégâts
        player.takeDamage();
        
        // Vérifier l'état du joueur
        expect(player.isAlive).toBe(false); // Le joueur est mort
        
        // Vérifier que la destruction est planifiée
        expect(scene.time.delayedCall).toHaveBeenCalledWith(
            1500,
            expect.any(Function)
        );
    });
    
    /**
    * Vérifie que le joueur tire correctement un projectile de gauche à droite.
    */
    test('Doit tirer un projectile de gauche à droite', () => {
        // Tirer un premier projectile
        player.shoot(300);
        
        // Vérifier que le projectile est créé
        expect(player.projectiles.create).toHaveBeenCalled();
        
        // Vérifier l'alternance des tirs
        expect(player.lastFiredLeft).toBe(false);
        
        // Tirer un deuxième projectile
        player.shoot(300);
        expect(player.lastFiredLeft).toBe(true);
    });
});