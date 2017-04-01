var Constants = {
	difficultyLevelScaling : 1.4,
	shieldLevelScaling : 1.38,
	weaponLevelScaling : 1.38,
	shipLevelPriceScaling : 1.43,
	levelsPerBoss:5,
	itemColors : {
		normal:0x2E7D32,
		super:0x1565C0,
		ultra:0x4527A0,
		hyper:0xEF6C00
	},
	itemBorders : {
		normal:0xC8E6C9,
		super:0xBBDEFB,
		ultra:0xD1C4E9,
		hyper:0xFFE0B2
	},
	itemBordersOld : {
		normal:0x1B5E20,
		super:0x0D47A1,
		ultra:0x311B92,
		hyper:0xE65100
	}
}

var gameModel = {
	weaponIdCounter:0
};

var calculateShipLevel = function() {
	return Math.floor(((gameModel.p1.frontWeapon ? gameModel.p1.frontWeapon.level : 0) +
		(gameModel.p1.turretWeapon ? gameModel.p1.turretWeapon.level : 0) +
		(gameModel.p1.rearWeapon ? gameModel.p1.rearWeapon.level : 0) +
		(gameModel.p1.shield ? gameModel.p1.shield.level : 0)) / 4);
}

var calculateIncome = function() {
	var amount = 0;
	for (var i=0; i<gameModel.history.length; i++) {
		amount += 10 * Math.pow(1.4,Math.max(
			Math.abs(gameModel.history[i].start.x),
			Math.abs(gameModel.history[i].start.y),
			Math.abs(gameModel.history[i].end.x),
			Math.abs(gameModel.history[i].end.y)
		));
	}
	return amount * 100;
}

var calculateIncomeSinceLastCheck = function() {
	if (gameModel.lastTradeUpdate < new Date().getTime() - 120000) {
		var timeDifference = (new Date().getTime() - gameModel.lastTradeUpdate) / 3600000;
		var amountEarned = timeDifference * calculateIncome();
		addCredits(amountEarned);
		gameModel.lastTradeUpdate = new Date().getTime();
		return amountEarned;
	}
	return 0;
}

function save() {
	if (typeof (Storage) === "undefined")
		return;

	setTimeout(function () {
	    localStorage.setItem("gameModel", JSON.stringify(gameModel));
	});
}

function load() {
	if (typeof (Storage) === "undefined")
		return;

	if (localStorage.getItem("gameModel") !== null)
	    gameModel = JSON.parse(localStorage.getItem("gameModel"));
	else {
		gameModel = {
			levelsUnlocked : 1,
			currentLevel : 1,
			timeStep : 1,
			purchaseHistory : [],
			masterVolume : 0.5,
			maxScreenShake : 5,
			dmgNumbers : false,
			p1 : {
				ship: Shipyard.generateShip(1, 1, false),
				weapons: [Weapons.generateWeapon(1,123,false)],
				shields: [ArmsDealer.generateShield(1, 234, false)],
				credits: 0,
				totalCredits: 0,
				temporaryCredits : 0,
				upgrades:[]
			},
			p2 : {
				ship: {seed:1, range:10},
				weapons: [],
				shields: [],
				credits: 0,
				totalCredits: 0,
				upgrades:[]
			},
			currentSystem: {x:0,y:0},
			targetSystem: {x:0,y:0},
			history: [],
			weaponIdCounter: gameModel.weaponIdCounter,
			lastTradeUpdate: new Date().getTime()
		};
		gameModel.p1.turretWeapon = gameModel.p1.weapons[0];
		gameModel.p1.shield = gameModel.p1.shields[0];
	}
}

function resetSaveGame() {
    localStorage.removeItem('gameModel');
    location.reload(true);
}

function addCredits (value) {
	if (currentState == states.running) {
		gameModel.p1.temporaryCredits += value;
	} else {
		gameModel.p1.credits += value;
		gameModel.p1.totalCredits += value;
	}

	save();
}
