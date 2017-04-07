Weapons = {
  types : {
    plasmaCannon:0,
  	railGun:1,
	  missileLauncher:2,
    vulcanCannon:3
  },
  rarity : [
    {
      factor:1,
      chance:1,
      prefix: ""
    },
    {
      super:true,
      factor:1.5,
      chance:0.3,
      prefix : "Super "
    },
    {
      ultra:true,
      factor:2,
      chance:0.08,
      prefix : "Ultra "
    },
    {
      hyper:true,
      factor:3.5,
      chance:0.02,
      prefix : "Hyper "
    }
  ]
};

Weapons.plasmaCannon = function(level,seed,rarity) {

	var levelMod = Math.pow(Constants.weaponLevelScaling, level - 1);
	Math.seedrandom(seed);
	var dps = (level * 9 + (Math.random() * level * 2)) * levelMod * rarity.factor;
	var shotsPerSecond = 6 + Math.random() * 5;
	var damagePerShot = dps / shotsPerSecond;
  var bulletsPerShot = 1;

  if (level >= 5 && Math.random() > 0.7)
	  bulletsPerShot++;

  if (level >= 10 && Math.random() > 0.7)
	  bulletsPerShot++;

	var plasmaCannon =  {
		ultra:rarity.ultra,
    hyper:rarity.hyper,
    super:rarity.super,
		type: Constants.itemTypes.weapon,
		name: (bulletsPerShot == 3 ? "Triple " : (bulletsPerShot == 2 ? "Double " : "")) + rarity.prefix + "Plasma Cannon",
		bullets : bulletsPerShot,
		seed: seed,
		level: level,
		dps: dps,
		shotsPerSecond: shotsPerSecond,
		damagePerShot: damagePerShot,
		accuracy: 0.5 + Math.random() * 0.5,
		bulletSpeed: 400,
		price: Math.round(dps * 30),
		id: gameModel.weaponIdCounter++,
		weaponType : Weapons.types.plasmaCannon
	};

	if (rarity.ultra || rarity.hyper) {
		if (Math.random() > 0.7 ) {
			plasmaCannon.ricochet = 0.1 + (Math.random() * 0.2);
			plasmaCannon.ultraName = "Second Chances";
			plasmaCannon.ultraText = "Bullets have a " + Math.round(plasmaCannon.ricochet * 100) + "% chance to ricochet off the edge of the screen";
		} else {
			plasmaCannon.passThrough = 0.1 + (Math.random() * 0.2);
			plasmaCannon.ultraName = "Deep Thunder";
			plasmaCannon.ultraText = "Bullets have a " + Math.round(plasmaCannon.passThrough * 100) + "% chance to not be destroyed";
		}

	}

	return plasmaCannon;
};

Weapons.laserCannon = function(level,seed,rarity) {

	var levelMod = Math.pow(Constants.weaponLevelScaling, level - 1);
	Math.seedrandom(seed);
	var dps = (level * 9 + (Math.random() * level * 2)) * levelMod * rarity.factor;
	var shotsPerSecond = 0.6 + Math.random() * 1.3;
	var damagePerShot = dps / shotsPerSecond;
	var laserCannon = {
    super:rarity.super,
		ultra:rarity.ultra,
    hyper:rarity.hyper,
		type: Constants.itemTypes.weapon,
		name: rarity.prefix + "Railgun",
		seed: seed,
		level: level,
		dps: dps,
		shotsPerSecond: shotsPerSecond,
		damagePerShot: damagePerShot,
		accuracy: 0.5 + Math.random() * 0.5,
		price: Math.round(dps * 30),
		id: gameModel.weaponIdCounter++,
		weaponType : Weapons.types.railGun
	};

	if (rarity.ultra || rarity.hyper) {
		laserCannon.splitBeamOnKill = true;
		laserCannon.ultraName = "Chain Reaction";
		laserCannon.ultraText = "Whenever this gun destroys an enemy, the beam will split";
	}

	return laserCannon;
};

Weapons.missileLauncher = function(level, seed, rarity) {

	var levelMod = Math.pow(Constants.weaponLevelScaling, level - 1);
	Math.seedrandom(seed);
	var dps = (level * 9 + (Math.random() * level * 2)) * levelMod * rarity.factor;
	var shotsPerSecond = 1 + Math.random() * 3;
	var damagePerShot = dps / shotsPerSecond;
	var missileLauncher = {
    super:rarity.super,
		ultra:rarity.ultra,
    hyper:rarity.hyper,
		type: Constants.itemTypes.weapon,
		name: rarity.prefix + "Missile Launcher",
		seed: seed,
		level: level,
		dps: dps,
		shotsPerSecond: shotsPerSecond,
		damagePerShot: damagePerShot,
		accuracy: 0.5 + Math.random() * 0.5,
		price: Math.round(dps * 30),
		id: gameModel.weaponIdCounter++,
		weaponType : Weapons.types.missileLauncher
	};

	if (rarity.ultra || rarity.hyper) {
		missileLauncher.lowHealthSeek = true;
		missileLauncher.ultraText = "Missiles automatically lock on to the most damaged enemy ship";
		missileLauncher.ultraName = "Widowmaker";
	}

	return missileLauncher;
};

Weapons.getIconSvg =  function(item) {
  if (item.weaponType == Weapons.types.plasmaCannon) {
    if (item.bullets == 3)
      return "img/level-three.svg";
    if (item.bullets == 2)
      return "img/level-two.svg";
    return "img/level-one.svg";
  }
  if (item.weaponType == Weapons.types.railGun)
    return "img/target-laser.svg";
  if (item.weaponType == Weapons.types.missileLauncher)
    return "img/barbed-arrow.svg";
  if (item.weaponType == Weapons.types.vulcanCannon)
      return "img/blaster.svg";
};

Weapons.generateWeapon = function(level, seed, ultra) {

  var weaponRarity = Weapons.rarity[0];

  for (var i=0; i<Weapons.rarity.length; i++) {
    if (ultra && Math.random() < Weapons.rarity[i].chance) {
      weaponRarity = Weapons.rarity[i];
    }
  }

	if (Math.random() > 0.7)
		return Weapons.laserCannon(level,seed,weaponRarity);

  if (Math.random() > 0.7)
		return Weapons.missileLauncher(level,seed,weaponRarity);

  if (Math.random() > 0.7)
  	return VulcanCannon.vulcanCannon(level,seed,weaponRarity);

	return Weapons.plasmaCannon(level,seed,weaponRarity);
};

Weapons.createWeaponLogic = function(weapon, container) {
  if (weapon.weaponType == Weapons.types.plasmaCannon)
    return PlasmaCannon.create(weapon, container);

  if (weapon.weaponType == Weapons.types.vulcanCannon)
    return VulcanCannon.create(weapon, container);

  if (weapon.weaponType == Weapons.types.railGun)
    return RailGun.create(weapon, container);

  if (weapon.weaponType == Weapons.types.missileLauncher)
    return MissileLauncher.create(weapon, container);
};



Weapons.weaponLogic = {};

Weapons.update = function(timeDiff) {

  var shouldPlayerShoot = PlayerShip.playerShip.inPlay && PlayerShip.playerShip.rolling > 1 && (timeLeft > 0 || Boss.bossActive());

  if (gameModel.p1.frontWeapon && !Weapons.weaponLogic.frontWeapon)
    Weapons.weaponLogic.frontWeapon = Weapons.createWeaponLogic(gameModel.p1.frontWeapon, playerBulletContainer);

  if (gameModel.p1.turretWeapon && !Weapons.weaponLogic.turretWeapon)
    Weapons.weaponLogic.turretWeapon = Weapons.createWeaponLogic(gameModel.p1.turretWeapon, playerBulletContainer);

  if (gameModel.p1.rearWeapon && !Weapons.weaponLogic.rearWeapon)
    Weapons.weaponLogic.rearWeapon = Weapons.createWeaponLogic(gameModel.p1.rearWeapon, playerBulletContainer);


  if (Weapons.weaponLogic.frontWeapon) {
    Weapons.weaponLogic.frontWeapon.update(timeDiff);
    if (Weapons.weaponLogic.frontWeapon.readyToFire(shouldPlayerShoot, timeDiff)) {
      Weapons.weaponLogic.frontWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc - 8, angle:0}, 1);
    }
  }

  if (Weapons.weaponLogic.turretWeapon) {
    Weapons.weaponLogic.turretWeapon.update(timeDiff);
    if (Weapons.weaponLogic.turretWeapon.readyToFire(shouldPlayerShoot, timeDiff)) {
      Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle()}, 1);

      if (PlayerShip.playerShip.spreadShot) {
        Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle() - 0.12}, 1);
        Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle() + 0.12}, 1);
      } else if (PlayerShip.playerShip.crossShot) {
        Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle() + Math.PI}, 1);
        Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle() + Math.PI / 2}, 1);
        Weapons.weaponLogic.turretWeapon.fireShot({x: PlayerShip.playerShip.xLoc, y: PlayerShip.playerShip.yLoc, angle:Bullets.getTurretAngle() - Math.PI / 2}, 1);
      }
    }

  }

  if (Weapons.weaponLogic.rearWeapon) {
    Weapons.weaponLogic.rearWeapon.update(timeDiff);
    if (Weapons.weaponLogic.rearWeapon.readyToFire(shouldPlayerShoot, timeDiff)) {
      Weapons.weaponLogic.rearWeapon.fireShot({x: PlayerShip.playerShip.xLoc + 16, y: PlayerShip.playerShip.yLoc + 16, angle: (Math.PI / 8) * (Weapons.weaponLogic.rearWeapon.rearAngleMod || 1)}, 0.5);
      Weapons.weaponLogic.rearWeapon.fireShot({x: PlayerShip.playerShip.xLoc - 16, y: PlayerShip.playerShip.yLoc + 16, angle:(-Math.PI / 8) * (Weapons.weaponLogic.rearWeapon.rearAngleMod || 1)}, 0.5);
    }
  }
};

Weapons.reset = function() {

  removeAllFromContainer(bulletContainer);
  removeAllFromContainer(playerBulletContainer);

  Bullets.enemyBullets.initialize();
  Weapons.weaponLogic = {};
};
