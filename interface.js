const submit = document.getElementById('calculator');
const expression = document.getElementById('expression');
const destination = document.getElementById('destination');

let hasDot = 0,
    isDecision = 0;

function stateInterface() {
    console.log(`hasDot: ${hasDot}, isDecision: ${isDecision}, ...`);
};

submit.onsubmit = function (event) {
    event.preventDefault();

    if (!expression.value) {
        expression.value = 0;
    }

    if (destination.innerText !== '0' || destination.innerText !== '') {
        expression.value += ' ' + destination.innerText;
        cleanDestination();
    }

    isDecision++;

    const calculator = new Calculator();
    let decision = calculator.calculate(expression.value);
    destination.innerText = decision;
};

function cleanAll() {
    expression.value = '';
    destination.innerText = '0';
    hasDot = 0;
    isDecision = 0;
};

function cleanDestination() {
    destination.innerText = '0';
    hasDot = 0;
    isDecision = 0;
};

function backspace() {

    if (destination.innerText.length === 1) {
        destination.innerText = '0';
        return;
    }

    if (destination.innerText[destination.innerText.length - 1] === '.') {
        hasDot = 0;
    }

    destination.innerText = destination.innerText.slice(0, destination.innerText.length - 1);
};

function putNumeric(num) {

    if (num === '.' && hasDot === 1) return;
    if (num === '.') hasDot++;

    if (destination.innerText.length === 1 && destination.innerText === '0' && num !== '.') {
        destination.innerText = num;
        return;
    }

    destination.innerText = destination.innerText + num;
};

function plusMinusToggler() {
    if (+destination.innerText[0] / 1 === +destination.innerText[0]) {
        destination.innerText = '-' + destination.innerText;
        return;
    };
    destination.innerText = destination.innerText.slice(1, destination.innerText.length);
};

function makeOperator(op) {
    expression.value = expression.value + ' ' + destination.innerText + ' ' + op;
    cleanDestination();
};

