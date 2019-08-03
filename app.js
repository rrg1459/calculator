let dot = error = result = build1 = build2 = false;
const numBtn    = document.querySelectorAll('.btn-num');
const opBtn     = document.querySelectorAll('.btn-op');
const clearBtn  = document.querySelector('.btn-clr');
const arrowBtn  = document.querySelector('.btn-arrow');
const dotBtn    = document.querySelector('.btn-dot');
const equalsBtn = document.querySelector('.btn-equals');
window.addEventListener("keyup", handleKeypress);

numBtn.forEach((e)                     => e.addEventListener('click', () => firstLine(e.innerText)));
opBtn.forEach((e)                      => e.addEventListener('click', () => secondLine(e.innerText)));
equalsBtn.addEventListener("click", () => operate());
clearBtn.addEventListener("click", ()  => clearDisplay());
arrowBtn.addEventListener("click", ()  => delOne());
dotBtn.addEventListener("click", ()    => addDot());

const add = (a,b) => a + b;
const sub = (a,b) => a - b;
const div = (a,b) => a / b;
const mul = (a,b) => a * b;

const operations = {"+" : add, "-" : sub, "/" : div, "X"  :mul }

function operate() {
	dot = error = build1 = build2 = false;
	pri = document.getElementById("line_primary").innerHTML;
	sec = document.getElementById("line_secondary").innerHTML;
	if ((result) || error || sec == '') return;
	sig = sec.slice(-1);
	if ((pri == '0' || pri == '0.') && sig == '/') {
		error = true;
		document.getElementById("line_primary").innerHTML = 'Error';
		sec += ' 0'
		document.getElementById("line_secondary").innerHTML = sec;
	} else {
		let arr = sec + ' ' + pri
		document.getElementById("line_secondary").innerHTML = arr;
		let largo = arr.length;
		if (largo > 26) {
			error = true;
			document.getElementById("line_secondary").innerHTML = 'stack overflow';
			document.getElementById("line_primary").innerHTML = '0';
		} else {
			arr = arr.split(' ');
			tot = Number(arr[0]);
			for (let i = 1; i < arr.length; i += 2 ){
				tot = operations[arr[i]](tot,Number(arr[i+1]))
			}
			result = true;
			if (tot > 99999999999999) {
				error = true;
				document.getElementById("line_primary").innerHTML = 'stack overflow';
			} else {
				let str = tot.toString();
				let largo = str.length;
				if (largo > 17) {
					let cortar = (largo - 17) * -1;
					tot = str.slice(0, cortar);
				}
				document.getElementById("line_primary").innerHTML = tot;
			};
		};
	};
};

function addDot() {
	if (error) {
		error = false
		document.getElementById("line_primary").innerHTML = '0.';
		document.getElementById("line_secondary").innerHTML = '';
		return;
	};
	if (!dot) {
		dot = true;
		document.getElementById("line_primary").innerHTML += '.';
	}
};

function delOne() {
	if (error) {
		error = false
		document.getElementById("line_primary").innerHTML = 0;
		document.getElementById("line_secondary").innerHTML = '';
		return;
	};
	let str = document.getElementById("line_primary").innerHTML
	if (str.slice(-1) == '.') dot = false;
	if (str.length > 1) {
		let arr = str.slice(0, -1);
		document.getElementById("line_primary").innerHTML = arr;
	} else {
		document.getElementById("line_primary").innerHTML = "0";
	}
	if (str=='0') document.getElementById("line_secondary").innerHTML = '';
};

function clearDisplay() { 
	dot = error = result = build1 = false;
	document.getElementById("line_primary").innerHTML = '0';
	document.getElementById("line_secondary").innerHTML = '';
};


function handleKeypress(e) {
	let event = e.key
	if ((event >= 0 && event <= 9) || event === '.') {
		if (event=='.') event = '0.';
		return firstLine(event);
	} else if (event === '+' || event === '-' || event === '*' || event === '/') {
		if (event=='*') event = 'X';
		return secondLine(event);
	} else if (event === 'Enter') {
		return operate();
	} else if (event === 'Backspace') {
		return delOne();
	} else if (event === 'Escape') {
		return clearDisplay();
	}
}

function secondLine(sig) {
	if (error) {
		error = false
		document.getElementById("line_primary").innerHTML = 0;
		document.getElementById("line_secondary").innerHTML = '';
		return;
	};
	if (result) {
		result = false;
		pri = document.getElementById("line_primary").innerHTML;
		sec = pri + ' ' + sig;
		document.getElementById("line_secondary").innerHTML = sec;
		return;
	}
	pri = document.getElementById("line_primary").innerHTML;
	sec = document.getElementById("line_secondary").innerHTML;
	if ((pri=='0' || line_primary=='0.') || build1) {
		//build1 = false;
		if (sec != '') { 
			let str = document.getElementById("line_secondary").innerHTML
			let arr = str.slice(0, -1);
			document.getElementById("line_secondary").innerHTML = arr + sig;
		}
	} else {
		if (pri.slice(-1) == '.') pri = pri.slice(0, -1);
		dot = false;
		let _all = '';
		if (sec=='') {
			_all = pri + ' ' + sig;
		} else {
			if (build2) {
				_all = sec + ' ' + pri + ' ' + sig;
			} else {
				_all = pri + ' ' + sig;
			}
		}
		document.getElementById("line_secondary").innerHTML = _all;
		build1 = true;
	}
};

function firstLine(str) {
	if (error) {
		error = dot = false;
		document.getElementById("line_primary").innerHTML = str;
		document.getElementById("line_secondary").innerHTML = '';
		return;
	};
	const pri = document.getElementById("line_primary").innerHTML;
	const sec = document.getElementById("line_secondary").innerHTML;
	const piece = sec.slice(0, -2);
	if (build1) {
		document.getElementById("line_primary").innerHTML = str
		build1 = false;
		return
	};
	if (document.getElementById("line_primary").innerHTML=='0') {
		document.getElementById("line_primary").innerHTML = str;
	} else {
		if (pri==piece) {
			if (build2){
				document.getElementById("line_primary").innerHTML += str;
			} else {
				document.getElementById("line_primary").innerHTML = str;
			}
		} else {
			document.getElementById("line_primary").innerHTML += str;
		};
	}
	build2 = true;
	const large = document.getElementById("line_primary").innerHTML;
	if (large.length > 17) {
		document.getElementById("line_primary").innerHTML = 'stack overflow';
		error = true;
	}
};