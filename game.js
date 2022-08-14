class levelSize {
	rows
	columns
	constructor(rows, columns) {
		this.rows = rows;
		this.columns = columns;
	}
}

class FindNum {
	currLvl = 1;
	score = 0;
	target;
	bonus = 1;
	time = 60;

	table = document.querySelector('#table');
	gameStatus = document.querySelector('#status').firstElementChild;
	lvlTarget = document.querySelector('#rectangle').lastElementChild;
	game = document.querySelector('.game');

	constructor() { }

	colors = {
		0: "#ed8b36", //orange
		1: "#4cb7ea", //blue
		2: "#9bc54c", //green
		3: "#8e3dcb", //violet
		4: "#fc73b0" //pink
	}

	statusColors = {
		0: "#f7bb87", //orange
		1: "#94d4f4", //blue
		2: "#bfdf94", //green
		3: "#bc8de0", //violet
		4: "#fdabd0" //pink
	}

	animations = {
		0: "flicker",
		1: "rotate",
		2: "resize"
	}

	randomVal(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	getNum(lvl) {
		let min, max;
		if (lvl == 1) {
			min = 1
			max = 9
		} else if (lvl == 2) {
			min = 10
			max = 99
		} else if (lvl <= 7) {
			min = 100
			max = 999
		} else {
			min = 1000
			max = 9999
		}
		return this.randomVal(min, max)
	}

	getArr(n, lvl) {
		const arr = []
		for (let i = 0; i < n; i++) {
			var x = this.getNum(lvl);
			while (arr.indexOf(x) != -1) {
				x = this.getNum(lvl);
			}
			arr[i] = x;
		}
		return arr
	}

	levels = [
		new levelSize(2, 3),
		new levelSize(2, 3),
		new levelSize(2, 3),
		new levelSize(3, 4),
		new levelSize(3, 4),
		new levelSize(4, 4),
		new levelSize(4, 4),
		new levelSize(5, 5),
		new levelSize(5, 5)
	]

	gameProcess() {
		this.table.innerHTML = "";
		let rows, columns;
		if (this.currLvl > 9) {
			rows = this.levels[this.levels.length - 1].rows;
			columns = this.levels[this.levels.length - 1].columns;
		} else {
			rows = this.levels[this.currLvl - 1].rows;
			columns = this.levels[this.currLvl - 1].columns;
		}
		const currArr = this.getArr(rows * columns, this.currLvl);
		this.target = currArr[this.randomVal(0, rows * columns - 1)];
		var bg = this.randomVal(0, 4);
		this.game.setAttribute("style", `background-color:${this.colors[bg]}`)
		this.gameStatus.setAttribute("style", `background-color:${this.statusColors[bg]}`)
		this.lvlTarget.innerHTML = `${this.target}`;
		for (let row = 0; row < rows; row++) {
			const tr = document.createElement('tr')
			var str = ""
			for (let col = 0; col < columns; col++) {
				var anim = this.animations[this.randomVal(0, 2)];
				var clr = this.colors[this.randomVal(0, 4)]
				str = str + `<td><button class="${anim}" style="background-color:${clr};">
									<p>${currArr[row * columns + col]}</p>
								</button></td>`;
			}
			tr.innerHTML = str
			this.table.append(tr);
		}
	}

	// Выбираем все кнопки на странице и получаем массив
	btnProc() {
		var btns = document.querySelectorAll('button')
		// Проходим по массиву
		btns.forEach((btn) => {
			// Вешаем событие клик
			btn.addEventListener('click', (e) => {
				let txt = btn.textContent || btn.innerText;
				if (txt == this.target) {
					this.currLvl++;
					this.score += 5 * this.bonus;
					this.bonus++;
				} else {
					if (this.currLvl > 1) {
						this.currLvl--;
					}
					if (this.bonus > 1) {
						this.bonus = 1;
					}
				}
				if (this.time > 0) {
					this.gameProcess();
					this.btnProc();
				} else {
					alert("Game over\nYour score: " + this.score);
					this.table.innerHTML = "";
				}
				this.gameStatus.innerHTML = "";
				const tr = document.createElement('tr')
				tr.innerHTML = `<td>Время: ${this.time}</td>
						<td>Уровень: ${this.currLvl}</td>
						<td>Очки: ${this.score}</td>
						<td>Бонус: x${this.bonus}</td>`
				this.gameStatus.append(tr);
			})
		})
	}

	startGame() {
		var timer = setInterval(() => {
			if (this.time <= 0) {
				clearInterval(timer);
			}
			this.gameStatus.innerHTML = "";
			const tr = document.createElement('tr')
			tr.innerHTML = `<td>Время: ${this.time}</td>
					<td>Уровень: ${this.currLvl}</td>
					<td>Очки: ${this.score}</td>
					<td>Бонус: x${this.bonus}</td>`
			this.gameStatus.append(tr);
			--this.time; // Уменьшаем таймер
		}, 1000)
		this.gameProcess();
		this.btnProc();
	}


}

//Запуск игры
const game = new FindNum();
game.startGame();