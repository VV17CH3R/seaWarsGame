
var view = {
	displayMessage: function(msg){
		var messageArea = document.querySelector('#messageArea');
		messageArea.innerHTML = msg;
	},

	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


var model = {
	boardSize: 9,
	numShips: 6,
	shipLength: 3,
	shipsSunk: 0,

	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("Мы уже сюда стреляли!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Есть попадание!");

				if (this.isSunk(ship)) {
					view.displayMessage("Вы потопили корабль!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Промах.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Расположение кораблей: ");
		console.log(this.ships);
	},


	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},


	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

var controller = {
	gusses: 0,

	processGuess: function(guess){
		var location = parseGuess(guess);
		if(location){
			this.gusses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				view.displayMessage("ПОБЕДА! Результат: " + (18/this.gusses) + "  % попаданий.");
			}
		}
	}
}

function parseGuess(guess){
	var alphabet = [ "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И" ];

	if(guess === null || guess.length !== 2){
		alert("Вы ввели неверные координаты.");
	}else{
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if(isNaN(row) || isNaN(column)){
			alert("Вы ввели неверные координаты.");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("Вы ввели неверные координаты.");
		}else{
			return row + column;
		}
	}
	return null;
}

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton(){
	var guessInput = document.getElementById('guessInput');
	var guess = guessInput.value;
	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

window.onload = init;
