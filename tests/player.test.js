import Player from '../src/classes/player.js';
import Phaser from 'phaser';

jest.mock('../src/classes/healthbar.js'); // Mock de la classe HealthBar

/**
* Tests unitaires pour la classe Player.
*/
describe('Player Class', () => {
    let v_scene;
    let v_player;
    
    /**
    * Initialisation des ressources avant chaque test.
    */
    beforeEach(() => {
        // Mock de la scène Phaser
        v_scene = {
            add: { existing: jest.fn() },
            physics: { add: { existing: jest.fn(), group: jest.fn() } },
            scale: { width: 800, height: 600 },
            anims: { create: jest.fn(), generateFrameNumbers: jest.fn() },
            time: { delayedCall: jest.fn() },
        };
        
        // Création d'une instance de Player
        v_player = new Player(v_scene, 100, 100, 'playerTexture', 160, 'default');
    });
    
    /**
    * Vérifie que le joueur est initialisé avec les bons attributs.
    */
    test('Initialisation du joueur avec les bons attributs', () => {
        // Se référer aux propriétés telles qu’elles sont nommées dans la classe Player
        expect(v_player.m_speed).toBe(160);           // Vitesse initiale
        expect(v_player.m_isAlive).toBe(true);        // Le joueur est vivant par défaut
        expect(v_player.m_currentWeapon).toBe('default'); // Arme par défaut
    });
    
    /**
    * Vérifie que le déplacement modifie correctement la vélocité.
    */
    test('Modification de la vélocité sur le move()', () => {
        const v_cursors = { left: { isDown: true }, right: { isDown: false } };
        
        // Appeler la méthode move()
        v_player.move(v_cursors);
        
        // Vérifier la vélocité
        expect(v_player.body.velocity.x).toBe(-160);  // Mouvement à gauche
        expect(v_player.body.velocity.y).toBe(0);     // Pas de mouvement vertical
    });
    
    /**
    * Vérifie que le joueur prend des dégâts et meurt correctement.
    */
    test('Prend des dégâts et meurt si sa vie atteint 0', () => {
        // Simuler une santé proche de zéro
        v_player.m_healthBar.m_health = 1;
        
        // Appliquer des dégâts
        v_player.takeDamage();
        
        // Vérifier l'état du joueur
        expect(v_player.m_isAlive).toBe(false); // Le joueur est mort
        
        // Vérifier que la destruction est planifiée
        expect(v_scene.time.delayedCall).toHaveBeenCalledWith(
            1500,
            expect.any(Function)
        );
    });
    
    /**
    * Vérifie que le joueur tire correctement un projectile de gauche à droite.
    */
    test('Doit tirer un projectile de gauche à droite', () => {
        // Tirer un premier projectile
        v_player.shoot(300);
        
        // Vérifier que le projectile est créé
        // Dans la classe Player, le groupe de projectiles est nommé `m_projectiles`.
        expect(v_player.m_projectiles.create).toHaveBeenCalled();
        
        // Vérifier l'alternance des tirs
        expect(v_player.m_lastFiredLeft).toBe(false);
        
        // Tirer un deuxième projectile
        v_player.shoot(300);
        expect(v_player.m_lastFiredLeft).toBe(true);
    });
});