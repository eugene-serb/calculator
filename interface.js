const submit = document.getElementById('calculator');
const expression = document.getElementById('expression');
const destination = document.getElementById('destination');

let isDicision = 0;
let hasDot = 0;
let hasOperator = 0;
let leftBracketCount = 0;
let rightBracketCount = 0;

function stateInterface() {
    console.log(`isDicision: ${isDicision}, hasDot: ${hasDot}, hasOperator: ${hasOperator}`);
    console.log(`leftBracketCount: ${leftBracketCount}, rightBracketCount: ${rightBracketCount}, ...`);
};

submit.onsubmit = function (event) {
    event.preventDefault();

    if (isDicision === 1) return;
    isDicision++;

    if (hasOperator === 0 && destination.innerText !== '0') {
        expression.value = expression.value + destination.innerText;
    } else if (hasOperator === 1) {
        expression.value = expression.value.slice(0, expression.value.length - 2);
    }

    if (leftBracketCount > rightBracketCount) {
        for (let i = 0; i < leftBracketCount - rightBracketCount; i++) {
            expression.value = expression.value + ')';
        }
    }

    const calculator = new Calculator();
    let decision = calculator.calculate(expression.value);
    destination.innerText = decision;
};

function cleanAll() {
    expression.value = '';
    destination.innerText = '0';
    isDicision = 0;
    hasDot = 0;
    hasOperator = 0;
    leftBracketCount = 0;
    rightBracketCount = 0;
};

function cleanDestination() {
    destination.innerText = '0';
    hasDot = 0;
};

function backspace() {
    if (destination.innerText === '0') return;
    if (destination.innerText[destination.innerText.length - 1] === '.') hasDot--;
    if (destination.innerText.length === 1) {
        destination.innerText = '0';
        return;
    }
    destination.innerText = destination.innerText.slice(0, destination.innerText.length - 1);
};

function putNumeric(num) {
    if (isDicision === 1) cleanAll();
    if (hasOperator !== 0) {
        hasOperator = 0;
        cleanDestination();
    };
    if (num === '.' && hasDot === 1) return;
    if (num === '.') hasDot++;
    if (destination.innerText === '' || destination.innerText === '0' && num !== '.') {
        destination.innerText = num;
        return;
    }
    destination.innerText = destination.innerText + num;
};

function makeOperator(op) {
    if (isDicision === 1) {
        let num = destination.innerText;
        cleanAll();
        destination.innerText = num;
    }
    if (hasOperator === 1) {
        expression.value = expression.value.slice(0, expression.value.length - 2) + op + ' ';
        return;
    }
    if (destination.innerText[destination.innerText.length - 1] === '.') {
        destination.innerText = destination.innerText + '0';
    }
    expression.value = expression.value + destination.innerText + ' ' + op + ' ';
    hasOperator++;
};

function plusMinusToggler() {
    if (destination.innerText[0] !== '-') {
        destination.innerText = '-' + destination.innerText;
        return;
    }
    destination.innerText = destination.innerText.slice(1, destination.innerText.length);
};

function leftBracketPlacer() {
    expression.value = expression.value + '(';
    leftBracketCount++;
};

function rightBracketPlacer() {
    if (leftBracketCount <= rightBracketCount) return;

    if (destination.innerText !== '0' && hasOperator === 0) {
        expression.value = expression.value + destination.innerText + ')';
        rightBracketCount++;
        cleanDestination();
        return;
    }

    expression.value = expression.value + ')';
    rightBracketCount++;
};
