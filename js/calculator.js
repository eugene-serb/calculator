/* ---------- */
/* CALCULATOR */
/* ---------- */

'use strict'

class Calculator {
    constructor() {
        this.solve = (expression) => {
            let result = this.#validate(expression);
            if (result !== 0) return result;
            result = this.#calculate(expression);
            return result;
        };
    };

    #validate = (expression) => {
        const symbolInspector = (expression) => {
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === '-' || expression[i] === '+' ||
                    expression[i] === '/' || expression[i] === '*' ||
                    expression[i] === '(' || expression[i] === ')' ||
                    expression[i] === ' ') continue;
                if (+expression[i] / 1 === +expression[i]) continue;
                if (expression[i] === '.') continue;

                return 1;
            };
            return 0;
        };
        const bracketsCounter = (expression) => {
            let left = 0;
            let right = 0;
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === '(') {
                    left++;
                    continue;
                };
                if (expression[i] === ')') {
                    right++;
                    continue;
                };
            };
            if (left !== right) return 1;
            return 0;
        };
        const noAssociatedBracketsInspector = (expression) => {
            let noAssociatedBrackets = 0;
            let left = 0;
            let right = 0;

            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === '(') left++;
                if (expression[i] === ')') right++;

                if (left < right) noAssociatedBrackets++;
            };

            if (noAssociatedBrackets !== 0) return 1;
            return 0;
        };
        const operatorStreakInspector = (expression) => {
            for (let i = 0; i < expression.length; i++) {
                if ((expression[i] === '+' || expression[i] === '-' || expression[i] === '*' || expression[i] === '/') &&
                    (expression[i - 1] === '+' || expression[i - 1] === '-' || expression[i - 1] === '*' || expression[i - 1] === '/') &&
                    (expression[i + 1] === '+' || expression[i + 1] === '-' || expression[i + 1] === '*' || expression[i + 1] === '/')) {
                    return 1;
                };
            };
            return 0;
        };

        if (!expression) return 'Expression is empty...';
        if (symbolInspector(expression) !== 0) return 'Expression contains an unexpected symbols...';
        if (bracketsCounter(expression) !== 0) return 'Expression contains no equal count of brackets...';
        if (noAssociatedBracketsInspector(expression) !== 0) return 'Expression contains no associated brackets...'
        if (operatorStreakInspector(expression) !== 0) return 'Expression contains streak operator...';

        return 0;
    };
    #calculate = (expression) => {
        const replacer = (expression, leftRange, rightRange, decision) => {
            let newExpression = expression.slice(0, leftRange) + decision + expression.slice(rightRange + 1, expression.length);
            return newExpression;
        };
        const decider = (leftOperand, rightOperand, operator) => {
            let decision = 0;
            switch (operator) {
                case '*':
                    decision = +leftOperand * +rightOperand;
                    break;
                case '/':
                    decision = +leftOperand / +rightOperand;
                    break;
                case '+':
                    decision = +leftOperand + +rightOperand;
                    break;
                case '-':
                    decision = +leftOperand - +rightOperand;
                    break;
                case '^':
                    decision = Math.pow(+leftOperand, +rightOperand);
                    break;
                case '#': // sqrt (x, n)
                    decision = Math.pow(+leftOperand, 1 / +rightOperand);
                    break;
                default:
                    break;
            };
            return decision;
        };
        const rightDelimiter = (expression, rightRange, operatorSubstring) => {
            let rightOperand = expression.slice(operatorSubstring + 1, rightRange + 1);
            return rightOperand;
        };
        const leftDelimiter = (expression, leftRange, operatorSubstring) => {
            let leftOperand = expression.slice(leftRange, operatorSubstring);
            return leftOperand;
        };
        const rightRangeSearcher = (expression, operatorSubstring) => {
            let rightRange = 0;
            for (let i = operatorSubstring + 1; i < expression.length; i++) {
                if (expression[i] === '.') continue;
                if (i + 1 === expression.length) {
                    rightRange = i;
                    break;
                };
                if (+expression[i] * 1 === +expression[i]) continue;
                if (expression[i] === '-' && i === operatorSubstring + 1) continue;
                rightRange = i - 1;
                break;
            };
            return rightRange;
        };
        const leftRangeSearcher = (expression, operatorSubstring) => {
            let leftRange = 0;
            for (let i = operatorSubstring - 1; i >= 0; i--) {
                if (expression[i] === '.') continue;
                if (+expression[i] * 1 === +expression[i]) continue;
                if (expression[i] === '-' && !(+expression[i - 1] * 1 === +expression[i - 1])) {
                    leftRange = i;
                    break;
                };
                leftRange = i + 1;
                break;
            };
            return leftRange;
        };
        const prioritetSearcher = (expression) => {
            let operatorSubstring = 0;
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === '+' || expression[i] === '-' && i !== 0) {
                    operatorSubstring = i;
                    break;
                };
            };
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === '/' || expression[i] === '*') {
                    operatorSubstring = i;
                    break;
                };
            };
            return operatorSubstring;
        };
        const endChecker = (expression) => {
            let decision = 0;
            for (let i = 0; i < expression.length; i++) {
                if (+expression[i] * 1 === +expression[i]) continue;
                if (!(+expression[i] * 1 === +expression[i]) && i === 0) continue;
                if (expression[i] === '.') continue;
                if (!(+expression[i] * 1 === +expression[i])) {
                    decision = 1;
                    break;
                };
                decision = 0;
                break;
            };
            return decision;
        };
        const calculator = (expression) => {
            while (endChecker(expression)) {
                let operatorSubstring = prioritetSearcher(expression);
                let leftRange = leftRangeSearcher(expression, operatorSubstring);
                let rightRange = rightRangeSearcher(expression, operatorSubstring);
                let leftOperand = leftDelimiter(expression, leftRange, operatorSubstring);
                let rightOperand = rightDelimiter(expression, rightRange, operatorSubstring);
                let operator = expression[operatorSubstring];

                if (operator === '/' && rightOperand === '0') {
                    expression = 'Expression contains division by zero!';
                    break;
                };

                let decision = decider(leftOperand, rightOperand, operator);
                expression = replacer(expression, leftRange, rightRange, decision);
            };
            return expression;
        };

        const insertedExpressionReplacer = (expression, decision, openBracketSubstring, closeBracketSubstring) => {
            let newExpression = expression.slice(0, openBracketSubstring) + decision + expression.slice(closeBracketSubstring + 1, expression.length);
            return newExpression;
        };
        const insertedExpressionExtractor = (expression, openBracketSubstring, closeBracketSubstring) => {
            let insertedExpression = expression.slice(openBracketSubstring + 1, closeBracketSubstring);
            return insertedExpression;
        };
        const openBracketSearcher = (expression, closeBracketSubstring) => {
            let openBracketSubstring = '';
            for (let i = closeBracketSubstring; i >= 0; i--) {
                if (expression[i] === '(') {
                    openBracketSubstring = i;
                    break;
                };
            };
            return openBracketSubstring;
        };
        const closeBracketSearcher = (expression) => {
            let closeBracketSubstring = '';
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === ')') {
                    closeBracketSubstring = i;
                    break;
                };
            };
            return closeBracketSubstring;
        };
        const bracketManipulator = (expression) => {
            do {
                let closeBracketSubstring = closeBracketSearcher(expression);
                if (closeBracketSubstring === '') break;
                let openBracketSubstring = openBracketSearcher(expression, closeBracketSubstring);
                let insertedExpression = insertedExpressionExtractor(expression, openBracketSubstring, closeBracketSubstring);
                let decision = calculator(insertedExpression);

                if (!(+decision[0] * 1 === +decision[0])) {
                    return decision;
                };

                expression = insertedExpressionReplacer(expression, decision, openBracketSubstring, closeBracketSubstring);
            } while (true);

            return expression;
        };

        const spacesCleaner = (expression) => {
            for (let i = 0; i < expression.length; i++) {
                if (expression[i] === ' ') {
                    expression = expression.slice(0, i) + expression.slice(i + 1, expression.length);
                    i--;
                };
            };
            return expression;
        };

        let result = '(' + spacesCleaner(expression) + ')';
        result = bracketManipulator(result);
        return result;
    };
};

class Interface {
    constructor() {
        this.calculator = new Calculator();
        this.#DOMs();
        this.#eventListeners();
        this.#cleanAll();
    };

    #solve = () => {
        if (this.isDicision === 1) return;
        this.isDicision++;
        if (this.hasOperator === 0 && this.$OUTPUT.innerText !== '0') {
            this.$INPUT.value = this.$INPUT.value + this.$OUTPUT.innerText;
        } else if (this.hasOperator === 1) {
            this.$INPUT.value = this.$INPUT.value.slice(0, this.$INPUT.value.length - 2);
        };
        if (this.leftBracketCount > this.rightBracketCount) {
            for (let i = 0; i < this.leftBracketCount - this.rightBracketCount; i++) {
                this.$INPUT.value = this.$INPUT.value + ')';
            };
        };
        this.$OUTPUT.innerText = this.calculator.solve(this.$INPUT.value);
    };
    #cleanAll = () => {
        this.$INPUT.value = '';
        this.$OUTPUT.innerText = '0';
        this.isDicision = 0;
        this.hasDot = 0;
        this.hasOperator = 0;
        this.leftBracketCount = 0;
        this.rightBracketCount = 0;
    };
    #cleanDestination = () => {
        this.$OUTPUT.innerText = '0';
        this.hasDot = 0;
    };
    #backspace = () => {
        if (this.$OUTPUT.innerText === '0') return;
        if (this.$OUTPUT.innerText[this.$OUTPUT.innerText.length - 1] === '.') this.hasDot--;
        if (this.$OUTPUT.innerText.length === 1) {
            this.$OUTPUT.innerText = '0';
            return;
        }
        this.$OUTPUT.innerText = this.$OUTPUT.innerText.slice(0, this.$OUTPUT.innerText.length - 1);
    };
    #putNumeric = (num) => {
        if (this.isDicision === 1) this.#cleanAll();
        if (this.hasOperator !== 0) {
            this.hasOperator = 0;
            this.#cleanDestination();
        };
        if (num === '.' && this.hasDot === 1) return;
        if (num === '.') this.hasDot++;
        if (this.$OUTPUT.innerText === '' || this.$OUTPUT.innerText === '0' && num !== '.') {
            this.$OUTPUT.innerText = num;
            return;
        };
        this.$OUTPUT.innerText = this.$OUTPUT.innerText + num;
    };
    #makeOperator = (operator) => {
        if (this.isDicision === 1) {
            this.#cleanAll();
            let num = this.$OUTPUT.innerText;
            this.$OUTPUT.innerText = num;
        };
        if (this.hasOperator === 1) {
            this.$INPUT.value = this.$INPUT.value.slice(0, this.$INPUT.value.length - 2) + operator + ' ';
            return;
        };
        if (this.$OUTPUT.innerText[this.$OUTPUT.innerText.length - 1] === '.') {
            this.$OUTPUT.innerText = this.$OUTPUT.innerText + '0';
        };
        this.$INPUT.value = this.$INPUT.value + this.$OUTPUT.innerText + ' ' + operator + ' ';
        this.hasOperator++;
    };
    #plusMinusToggler = () => {
        if (this.$OUTPUT.innerText[0] !== '-') {
            this.$OUTPUT.innerText = '-' + this.$OUTPUT.innerText;
            return;
        };
        this.$OUTPUT.innerText = this.$OUTPUT.innerText.slice(1, this.$OUTPUT.innerText.length);
    };
    #leftBracketPlacer = () => {
        this.$INPUT.value = this.$INPUT.value + '(';
        this.leftBracketCount++;
    };
    #rightBracketPlacer = () => {
        if (this.leftBracketCount <= this.rightBracketCount) return;
        if (this.$OUTPUT.innerText !== '0' && this.hasOperator === 0) {
            this.$INPUT.value = this.$INPUT.value + this.$OUTPUT.innerText + ')';
            this.rightBracketCount++;
            this.#cleanDestination();
            return;
        };
        this.$INPUT.value = this.$INPUT.value + ')';
        this.rightBracketCount++;
    };

    #DOMs = () => {
        this.$INPUT = document.getElementById('input');
        this.$OUTPUT = document.getElementById('output');
        this.$BUTTON_SOLVE = document.getElementById('solve');
        this.$BUTTON_CLEAN_ALL = document.getElementById('clean-all');
        this.$BUTTON_CLEAN_NUM = document.getElementById('clean-num');
        this.$BUTTON_BACKSPACE = document.getElementById('backspace');
        this.$BUTTON_LEFT_BRACKET = document.getElementById('leftBracket');
        this.$BUTTON_RIGHT_BRACKET = document.getElementById('rightBracket');
        this.$BUTTON_PLUS_MINUS = document.getElementById('plusMinus');
        this.$BUTTONS_NUMERIC = document.querySelectorAll('.button_numeric');
        this.$BUTTONS_OPERATOR = document.querySelectorAll('.button_operator');
    };
    #eventListeners = () => {
        this.$BUTTON_SOLVE.addEventListener('click', () => this.#solve());
        this.$BUTTON_CLEAN_ALL.addEventListener('click', () => this.#cleanAll());
        this.$BUTTON_CLEAN_NUM.addEventListener('click', () => this.#cleanDestination());
        this.$BUTTON_BACKSPACE.addEventListener('click', () => this.#backspace());
        this.$BUTTON_LEFT_BRACKET.addEventListener('click', () => this.#leftBracketPlacer());
        this.$BUTTON_RIGHT_BRACKET.addEventListener('click', () => this.#rightBracketPlacer());
        this.$BUTTON_PLUS_MINUS.addEventListener('click', () => this.#plusMinusToggler());
        this.$BUTTONS_NUMERIC.forEach(item => {
            item.addEventListener('click', () => {
                this.#putNumeric(item.innerText);
            });
        });
        this.$BUTTONS_OPERATOR.forEach(item => {
            item.addEventListener('click', () => {
                this.#makeOperator(item.innerText);
            });
        });
    };
};

/* -------------- */
/* INITIALIZATION */
/* -------------- */

const CALCULATOR = new Interface();

