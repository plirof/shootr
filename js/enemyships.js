﻿var EnemyShips = {};

EnemyShips.maxShipsPerWave = 16;
EnemyShips.minShipsPerWave = 4;
EnemyShips.shipHealth = 2;
EnemyShips.maxWaves = 3;

EnemyShips.waveBulletFrequency = 3000;

EnemyShips.explosionBits = [];
EnemyShips.bitsPerExplosion = 24;
EnemyShips.maxExplosionBits = 256;
EnemyShips.currentExplosionBit = 0;

EnemyShips.fragments = [];
EnemyShips.fragmentsPerExplosion = 8;
EnemyShips.maxExplosionFragments = 64;
EnemyShips.currentExplosionFragment = 0;


EnemyShips.generateExplosion = function (ship) {
    for (var i = 0; i < EnemyShips.bitsPerExplosion; i++) {

        if (EnemyShips.currentExplosionBit >= EnemyShips.maxExplosionBits)
            EnemyShips.currentExplosionBit = 0;

        EnemyShips.explosionBits[EnemyShips.currentExplosionBit] = {
            opacity: 255,
            xLoc: ship.xLoc,
            yLoc: ship.yLoc,
            color: Math.random() > 0.8 ? {r:255,g:190,b:51} : ship.wave.colorsRgb[Math.floor(Math.random() * ship.wave.colorsRgb.length)],
            xSpeed: (ship.xSpeed / 2) - 150 + Math.random() * 300,
            ySpeed: (ship.ySpeed / 2) - 150 + Math.random() * 300,
            vertical: Math.random() > 0.5
        };

        EnemyShips.currentExplosionBit++;
    }
	
	var fragmentCount = EnemyShips.fragmentsPerExplosion + Math.random() * EnemyShips.fragmentsPerExplosion;
	
	for (var i = 0; i < fragmentCount; i++) {
		
		if (EnemyShips.currentExplosionFragment >= EnemyShips.maxExplosionFragments)
            EnemyShips.currentExplosionFragment = 0;

        EnemyShips.fragments[EnemyShips.currentExplosionFragment] = {
            opacity: 1,
            xLoc: ship.xLoc - 5 + Math.random() * 10,
            yLoc: ship.yLoc - 5 + Math.random() * 10,
            bitmap: ship.wave.shipFragments[Math.floor(Math.random() * ship.wave.shipFragments.length)],
            xSpeed: (ship.xSpeed / 2) - 50 + Math.random() * 100,
            ySpeed: (ship.ySpeed / 2) - 50 + Math.random() * 100,
            rotation: Math.random() * 3.14,
			rotationSpeed: -1 + Math.random() * 2
        };
		EnemyShips.fragments[EnemyShips.currentExplosionFragment].width = 
			EnemyShips.fragments[EnemyShips.currentExplosionFragment].bitmap.width;

        EnemyShips.currentExplosionFragment++;
	}
	
	if (Ships.currentBlast > Ships.maxBlasts)
		Ships.currentBlast = 0;
	
	Ships.blasts[Ships.currentBlast] = {
		opacity:1,
		xLoc: ship.xLoc - 32,
        yLoc: ship.yLoc - 32
	};

	Ships.currentBlast++;
};
    
EnemyShips.lastWave = 0;
EnemyShips.waveFrequency = 10000;

EnemyShips.wavePatterns = [
    {
        xCoords: [-0.2, 0.8, 0.9],
        yCoords: [0.2 , 0.1, 1.3]
    },
	{
        xCoords: [0.9, 0.2, 0.1],
        yCoords: [-0.2 , 0.5, 1.3]
    },
	{
        xCoords: [0.5, 0.5, 0.1, 0.9, 0.2, 0.9, 0.2],
        yCoords: [-0.2 , 0.1, 0.3, 0.5, 0.7, 0.9, 1.1]
	},
    {
        xCoords: [-0.2,0.15,0.2,0.7,0.8,0.75,0.8,0.75,0.9],
        yCoords: [0.9,0.85,0.1,0.1,0.3,0.5,0.7,0.9,1.1]
    },
    {
        xCoords: [0.9, 0.9, 0.9, 0.5, 0],
        yCoords: [1.1, 0.9, 0.1, 0.1, 1.2]
    }
];
EnemyShips.patternCounter = Math.floor(Math.random() * EnemyShips.wavePatterns.length);

EnemyShips.waves = [];

EnemyShips.wave = function () {
    
    this.shipFrequency = 1000 + (Math.random() * 1000);
    this.lastShipSpawned = 0;
    
	while (typeof this.wavePattern === 'undefined') {
		if (EnemyShips.wavePatterns[EnemyShips.patternCounter].inUse) {
			EnemyShips.patternCounter++;			
			if (EnemyShips.patternCounter >= EnemyShips.wavePatterns.length)
				EnemyShips.patternCounter = 0;
		} else {
			this.wavePattern = EnemyShips.wavePatterns[EnemyShips.patternCounter];
			this.wavePattern.inUse = true;			
		}
	}

    this.shipsInWave = EnemyShips.minShipsPerWave + Math.round(Math.random() * (EnemyShips.maxShipsPerWave - EnemyShips.minShipsPerWave));
    this.shipsDestroyed = 0;
    var size = Math.round(32 + Math.random() * 32);
    this.colors = Ships.enemyColors[Math.floor(Math.random() * Ships.enemyColors.length)];
    this.colorsRgb = [];
    for (var i = 0; i < this.colors.length; i++) {
        this.colorsRgb[i] = hexToRgb(this.colors[i]);
    }

    this.shipHealth = EnemyShips.shipHealth;
    this.lastBullet = 0;
    
    this.shipArt = Ships.shipArt(size, Date.now(), true, this.colors);
	this.shipFragments = Ships.shipFragments(this.colors);
	
    this.offset = Math.round(size / 2);
    this.ships = [];
	this.shipsExited = 0;
};

EnemyShips.enemyShip = function (wave) {
    
    this.wave = wave;
	this.SHIP_TRAIL_COUNT = Ships.shipTrailCount;
    this.xLoc = canvasWidth * wave.wavePattern.xCoords[0];
    this.xTar = canvasWidth * wave.wavePattern.xCoords[1];
    this.yLoc = canvasHeight * wave.wavePattern.yCoords[0];
    this.yTar = canvasHeight * wave.wavePattern.yCoords[1];
    this.nextCoord = 1;
    this.maxSpeed = 100;
    this.health = wave.shipHealth;
    this.inPlay = 1;
    this.enemyShip = true;
	this.shipTrail = [];
	this.rotation=0;
	this.offset = wave.offset;

	for (var i = 0; i < this.SHIP_TRAIL_COUNT; i++) {
        this.shipTrail[i] = new Stars.shipTrailPart(this);
    }
};

EnemyShips.checkForPlayerCollision = function (ship) {
    if (Ships.detectShipCollision(ship, PlayerShip.playerShip)) {
        if (ship.health > PlayerShip.playerShip.health) {
            ship.health -= PlayerShip.playerShip.health;
            PlayerShip.playerShip.health -= ship.health;
        } else {
            ship.inPlay = 0;
            ship.wave.shipsDestroyed++;
            EnemyShips.generateExplosion(ship);
        }
    }
};

EnemyShips.checkForBulletCollisions = function (ship){
    for (var i = 0; i < Bullets.playerBullets.maxPlayerBullets; i++) {
        if (Bullets.playerBullets.inPlay[i] === 1) {
            if (Ships.detectCollision(ship, Bullets.playerBullets.xLoc[i], Bullets.playerBullets.yLoc[i])) {

                Bullets.playerBullets.inPlay[i] = 0;
                Bullets.generateExplosion(Bullets.playerBullets.xLoc[i], Bullets.playerBullets.yLoc[i]);
                ship.health -= Bullets.playerBullets.strength;
                if (ship.health <= 0) {
                    ship.inPlay = 0;
                    ship.wave.shipsDestroyed++;
                    EnemyShips.generateExplosion(ship);

                    credits += ship.wave.shipHealth;
                }
            }
        }
    }
};

EnemyShips.update = function (timeDiff) {

    EnemyShips.lastWave += timeDiff * 1000;

    for (var i = 0; i < EnemyShips.maxWaves; i++) {

        if (!EnemyShips.waves[i] || EnemyShips.waves[i].finished) {
            if (EnemyShips.lastWave >= EnemyShips.waveFrequency && Math.random() > 0.9) {
                EnemyShips.waves[i] = new EnemyShips.wave();
                EnemyShips.lastWave = 0;
            }
        } else {
            EnemyShips.waves[i].lastShipSpawned += timeDiff * 1000;
            EnemyShips.waves[i].lastBullet += timeDiff * 1000;
            for (var j = 0; j < EnemyShips.waves[i].shipsInWave; j++) {
                if (!EnemyShips.waves[i].ships[j]) {
                    if (EnemyShips.waves[i].lastShipSpawned >= EnemyShips.waves[i].shipFrequency) {
                        EnemyShips.waves[i].ships[j] = new EnemyShips.enemyShip(EnemyShips.waves[i]);
                        EnemyShips.waves[i].lastShipSpawned = 0;
                    }
                } else {
                    if (EnemyShips.waves[i].ships[j].inPlay) {
                        var eShip = EnemyShips.waves[i].ships[j];
                        if (Math.sqrt(Math.pow(eShip.xLoc - eShip.xTar, 2) +
                                        Math.pow(eShip.yLoc - eShip.yTar, 2)) > 5) {

                            var xDiff = eShip.xTar - eShip.xLoc;
                            var yDiff = eShip.yTar - eShip.yLoc;

                            Ships.updateShipSpeed(eShip, xDiff, yDiff, timeDiff);
							Ships.updateRotation(eShip,timeDiff);
							
                        } else {
                            eShip.nextCoord++;
                            
                            if (eShip.nextCoord >= EnemyShips.waves[i].wavePattern.xCoords.length) {
							    eShip.inPlay = 0;
								EnemyShips.waves[i].shipsExited++;	
							} else {
                                eShip.xTar = canvasWidth * EnemyShips.waves[i].wavePattern.xCoords[eShip.nextCoord];
                                eShip.yTar = canvasHeight * EnemyShips.waves[i].wavePattern.yCoords[eShip.nextCoord];
                            }
                        }
                        EnemyShips.checkForBulletCollisions(eShip);
                        EnemyShips.checkForPlayerCollision(eShip);

                        if (eShip.inPlay && EnemyShips.waves[i].lastBullet >= EnemyShips.waveBulletFrequency && Math.random() > 0.9) {
                            Bullets.newEnemyBullet(eShip);
                            EnemyShips.waves[i].lastBullet = 0;
                        }
                    }
                }
            }
			if (EnemyShips.waves[i].shipsExited + EnemyShips.waves[i].shipsDestroyed >= EnemyShips.waves[i].shipsInWave) {
				EnemyShips.waves[i].finished = true;
				EnemyShips.waves[i].wavePattern.inUse = false;
			}
        }
    }
};

EnemyShips.drawShipFragments = function (ctx, timeDiff) {
	if (EnemyShips.fragments.length > 0) {
		for (var i=0; i < EnemyShips.fragments.length; i++) {

			if (EnemyShips.fragments[i] && EnemyShips.fragments[i].opacity > 0) {
				
				EnemyShips.fragments[i].rotation += EnemyShips.fragments[i].rotationSpeed * timeDiff;
				EnemyShips.fragments[i].xLoc += EnemyShips.fragments[i].xSpeed * timeDiff;
				EnemyShips.fragments[i].yLoc += EnemyShips.fragments[i].ySpeed * timeDiff;

				ctx.save();
				ctx.translate(EnemyShips.fragments[i].xLoc, EnemyShips.fragments[i].yLoc);
				ctx.rotate(EnemyShips.fragments[i].rotation);
				ctx.globalAlpha = EnemyShips.fragments[i].opacity;
				ctx.drawImage(EnemyShips.fragments[i].bitmap, -EnemyShips.fragments[i].width / 2, 0);
				ctx.restore();

				EnemyShips.fragments[i].opacity -= (0.2 * timeDiff / EnemyShips.fragments[i].opacity);
        	}
		}
	}
	
	if (Ships.blasts.length > 0) {
		for (var i=0;i<Ships.blasts.length;i++) {
		    if (Ships.blasts[i] && Ships.blasts[i].opacity > 0) {
				ctx.globalAlpha = Ships.blasts[i].opacity;
				ctx.drawImage(Ships.shipBlastArt, Ships.blasts[i].xLoc, Ships.blasts[i].yLoc);
				Ships.blasts[i].opacity -= (6 * timeDiff);
			}
		}
	}

	
	for (var i = 0; i < Bullets.blasts.maxBlasts; i++) {
	    if (Bullets.blasts.opacity[i] && Bullets.blasts.opacity[i] > 0) {
	        ctx.globalAlpha = Bullets.blasts.opacity[i];
	        ctx.drawImage(Bullets.blasts.art, Bullets.blasts.xLoc[i], Bullets.blasts.yLoc[i]);
	        Bullets.blasts.opacity[i] -= (6 * timeDiff);
	    }
	}
	
	ctx.globalAlpha = 1;
};

EnemyShips.drawShips = function (ctx, timeDiff) {
	
	if (!EnemyShips.waves || EnemyShips.waves.length <= 0)
		return;
	
	if (EnemyShips.waves.length > 0) {
		for (var i = 0; i < EnemyShips.waves.length; i++) {
			if (EnemyShips.waves[i] && EnemyShips.waves[i].shipsInWave) {
				for (var j = 0; j < EnemyShips.waves[i].shipsInWave; j++) {
					if (EnemyShips.waves[i].ships[j] && EnemyShips.waves[i].ships[j].inPlay) {
						ctx.save();
						ctx.translate(EnemyShips.waves[i].ships[j].xLoc, EnemyShips.waves[i].ships[j].yLoc);
						ctx.rotate(-1 * EnemyShips.waves[i].ships[j].rotation);
						ctx.drawImage(EnemyShips.waves[i].shipArt, -EnemyShips.waves[i].offset, -EnemyShips.waves[i].offset);
						ctx.restore();
					}
				}
			}
		}		
	}
};