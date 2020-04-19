const submit = document.getElementById('calculator');
const expression = document.getElementById('expression');
const destination = document.getElementById('destination');

submit.onsubmit = function (event) {
    event.preventDefault();

    if (!expression.value) {
        expression.value = 0;
    }

    const calculator = new Calculator();
    let decision = calculator.calculate(expression.value);
    destination.innerText = decision;
};

