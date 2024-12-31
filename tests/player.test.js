import Player from '../src/classes/player';
import Phaser from 'phaser';

jest.mock('../src/classes/healthbar.js'); // Mock de la classe HealthBar

describe('Player Class', () => {
  let scene;
  let player;

  beforeEach(() => {
    scene = {
      add: { existing: jest.fn() },
      physics: { add: { existing: jest.fn(), group: jest.fn() } },
      scale: { width: 800, height: 600 },
      anims: { create: jest.fn(), generateFrameNumbers: jest.fn() },
      time: { delayedCall: jest.fn() },
    };

    player = new Player(scene, 100, 100, 'playerTexture', 160, 'default');
  });

  test('Initialisation du playerr avec les bons attributs', () => {
    expect(player.speed).toBe(160);
    expect(player.isAlive).toBe(true);
    expect(player.currentWeapon).toBe('default');
  });

  test('Modification de la vélocité sur le move()', () => {
    const cursors = { left: { isDown: true }, right: { isDown: false } };

    player.move(cursors);
    expect(player.body.velocity.x).toBe(-160);
    expect(player.body.velocity.y).toBe(0);
  });

  test('Prend des dégats et meurs si sa vie atteint 0', () => {
    player.healthBar.health = 1; // Simuler une santé proche de zéro
    player.takeDamage();

    expect(player.isAlive).toBe(false);
    expect(scene.time.delayedCall).toHaveBeenCalledWith(
      1500,
      expect.any(Function)
    );
  });

  test('Doit tirer un projectile de gauche à droite', () => {
    player.shoot(300);

    expect(player.projectiles.create).toHaveBeenCalled();
    expect(player.lastFiredLeft).toBe(false);

    player.shoot(300);
    expect(player.lastFiredLeft).toBe(true);
  });
});