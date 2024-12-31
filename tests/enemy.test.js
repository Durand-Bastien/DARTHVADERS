import Enemy from '../src/classes/enemy';
import Phaser from 'phaser';

describe('Enemy Class', () => {
  let scene;
  let enemy;
  let mockTarget;

  beforeEach(() => {
    mockTarget = { takeDamage: jest.fn() };
    scene = {
      add: { existing: jest.fn() },
      physics: { add: { existing: jest.fn(), group: jest.fn(), overlap: jest.fn() } },
      scale: { width: 800, height: 600 },
      anims: { create: jest.fn(), generateFrameNumbers: jest.fn(), exists: jest.fn(() => false) },
      time: { delayedCall: jest.fn() },
    };

    enemy = new Enemy(scene, 100, 100, 'enemyTexture', 5, mockTarget, 60);
  });

  test('Initialisation d\'un ennemie avec les bons attributs', () => {
    expect(enemy.speed).toBe(60);
    expect(enemy.maxHp).toBe(5);
    expect(enemy.currentHp).toBe(5);
    expect(enemy.isAlive).toBe(true);
  });

  test('Dois prendre des degats et mourrir quand il atteint 0 hp', () => {
    enemy.currentHp = 1;

    enemy.takeDamage();
    expect(enemy.currentHp).toBe(0);
    expect(enemy.isAlive).toBe(false);

    // Vérifie que la destruction de l'ennemi est planifiée
    expect(scene.time.delayedCall).toHaveBeenCalledWith(
      1000 / 6,
      expect.any(Function)
    );
  });

  test('Dois bouger dans le bon sens suivant sa vélocité', () => {
    enemy.move();

    expect(enemy.body.velocity.y).toBe(60);
  });

  test('Dois tirer un projectile en direction de la cible', () => {
    enemy.shootProjectile(300);

    // Vérifie que le projectile est créé
    expect(scene.physics.add.overlap).toHaveBeenCalledWith(
      expect.any(Object),
      mockTarget,
      expect.any(Function)
    );
  });
});