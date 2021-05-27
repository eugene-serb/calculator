class Calculator {

    constructor() { }

    calculate(expression) {
        return this._mediator(expression);
    }

    _mediator(expression) {
        if (!expression) return "Empty Expression!";

        expression = this._expressionValidator(expression);
        if (expression[expression.length - 1] === '!') return expression;

        expression = this._bracketManipulator(expression);

        return expression;
    }

    _bracketManipulator(expression) {

        expression = '(' + expression + ')';

        do {
            let closeBracketSubstring = this._closeBracketSearcher(expression);
            if (closeBracketSubstring === '') break;
            let openBracketSubstring = this._openBracketSearcher(expression, closeBracketSubstring);
            let insertedExpression = this._insertedExpressionExtractor(expression, openBracketSubstring, closeBracketSubstring);
            let decision = this._calculator(insertedExpression);

            if (!(+decision[0] * 1 === +decision[0])) {
                return decision;
            }

            expression = this._insertedExpressionReplacer(expression, decision, openBracketSubstring, closeBracketSubstring);
        } while (true);

        return expression;
    }

    _insertedExpressionReplacer(expression, decision, openBracketSubstring, closeBracketSubstring) {
        let newExpression = expression.slice(0, openBracketSubstring) + decision + expression.slice(closeBracketSubstring + 1, expression.length);
        return newExpression;
    }

    _insertedExpressionExtractor(expression, openBracketSubstring, closeBracketSubstring) {
        let insertedExpression = expression.slice(openBracketSubstring + 1, closeBracketSubstring);
        return insertedExpression;
    }

    _closeBracketSearcher(expression) {
        let closeBracketSubstring = '';

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === ')') {
                closeBracketSubstring = i;
                break;
            }
        }

        return closeBracketSubstring;
    }

    _openBracketSearcher(expression, closeBracketSubstring) {
        let openBracketSubstring = '';

        for (let i = closeBracketSubstring; i >= 0; i--) {
            if (expression[i] === '(') {
                openBracketSubstring = i;
                break;
            }
        }

        return openBracketSubstring;
    }

    _calculator(expression) {

        while (this._endChecker(expression)) {
            let operatorSubstring = this._prioritetSearcher(expression);
            let leftRange = this._leftRangeSearcher(expression, operatorSubstring);
            let rightRange = this._rightRangeSearcher(expression, operatorSubstring);
            let leftOperand = this._leftDelimiter(expression, leftRange, operatorSubstring);
            let rightOperand = this._rightDelimiter(expression, rightRange, operatorSubstring);
            let operator = expression[operatorSubstring];

            if (operator === '/' && rightOperand === '0') {
                expression = "Expression contains division by zero!";
                break;
            }

            let decision = this._decider(leftOperand, rightOperand, operator);
            expression = this._replacer(expression, leftRange, rightRange, decision);

            /*
            alert(`operatorSubstring ${operatorSubstring},
                leftRange ${leftRange},
                rightRange ${rightRange},
                leftOperand ${leftOperand},
                rightOperand ${rightOperand},
                operator ${operator},
                decision ${decision},
                expression ${expression}`);
            */
        }

        return expression;
    }

    _endChecker(expression) {
        let decision = 0;

        for (let i = 0; i < expression.length; i++) {
            if (+expression[i] * 1 === +expression[i]) continue;
            if (!(+expression[i] * 1 === +expression[i]) && i === 0) continue;
            if (expression[i] === '.') continue;
            if (!(+expression[i] * 1 === +expression[i])) {
                decision = 1;
                break;
            }
            decision = 0;
            break;
        }

        return decision;
    }

    _replacer(expression, leftRange, rightRange, decision) {
        let newExpression = expression.slice(0, leftRange) + decision + expression.slice(rightRange + 1, expression.length);
        return newExpression;
    }

    _leftDelimiter(expression, leftRange, operatorSubstring) {
        let leftOperand = expression.slice(leftRange, operatorSubstring);
        return leftOperand;
    }

    _rightDelimiter(expression, rightRange, operatorSubstring) {
        let rightOperand = expression.slice(operatorSubstring + 1, rightRange + 1);
        return rightOperand;
    }

    _leftRangeSearcher(expression, operatorSubstring) {
        let leftRange = 0;

        for (let i = operatorSubstring - 1; i >= 0; i--) {
            if (expression[i] === '.') continue;
            if (+expression[i] * 1 === +expression[i]) continue;
            if (expression[i] === '-' && !(+expression[i - 1] * 1 === +expression[i - 1])) {
                leftRange = i;
                break;
            }
            leftRange = i + 1;
            break;
        }

        return leftRange;
    }

    _rightRangeSearcher(expression, operatorSubstring) {
        let rightRange = 0;

        for (let i = operatorSubstring + 1; i < expression.length; i++) {
            if (expression[i] === '.') continue;
            if (i + 1 === expression.length) {
                rightRange = i;
                break;
            }

            if (+expression[i] * 1 === +expression[i]) continue;
            if (expression[i] === '-' && i === operatorSubstring + 1) continue;

            rightRange = i - 1;
            break;
        }

        return rightRange;
    }

    _prioritetSearcher(expression) {
        let operatorSubstring = 0;

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '+' || expression[i] === '-' && i !== 0) {
                operatorSubstring = i;
                break;
            }
        }

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '/' || expression[i] === '*') {
                operatorSubstring = i;
                break;
            }
        }

        return operatorSubstring;
    }

    _decider(leftOperand, rightOperand, operator) {
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
        }

        return decision;
    }

    _expressionValidator(expression) {

        expression = this._spacesCleaner(expression);
        expression = this._symbolInspector(expression);
        expression = this._bracketsCounter(expression);
        expression = this._noAssociatedBracketsInspector(expression);
        expression = this._operatorStreakInspector(expression);

        return expression;
    }

    _spacesCleaner(expression) {

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === ' ') {
                expression = expression.slice(0, i) + expression.slice(i + 1, expression.length);
            }
        }

        return expression;
    }

    _symbolInspector(expression) {

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '-' || expression[i] === '+' ||
                expression[i] === '/' || expression[i] === '*' ||
                expression[i] === '(' || expression[i] === ')') continue;

            if (+expression[i] / 1 === +expression[i]) continue;
            if (expression[i] === '.') continue;

            return "Expression contains an unexpected symbols!";
        }

        return expression;
    }

    _bracketsCounter(expression) {
        let left = 0;
        let right = 0;

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '(') {
                left++;
                continue;
            }
            if (expression[i] === ')') {
                right++;
                continue;
            }
        }

        if (left !== right) return "Expression contains no equal count of brackets!";

        return expression;
    }

    _noAssociatedBracketsInspector(expression) {
        let noAssociatedBrackets = 0;
        let left = 0;
        let right = 0;

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '(') left++;
            if (expression[i] === ')') right++;

            if (left < right) noAssociatedBrackets++;
        }

        if (noAssociatedBrackets !== 0) return "Expression contains no associated brackets!";
        return expression;
    }

    _operatorStreakInspector(expression) {
        for (let i = 0; i < expression.length; i++) {
            if ((expression[i] === '+' || expression[i] === '-' || expression[i] === '*' || expression[i] === '/') &&
                (expression[i - 1] === '+' || expression[i - 1] === '-' || expression[i - 1] === '*' || expression[i - 1] === '/') &&
                (expression[i + 1] === '+' || expression[i + 1] === '-' || expression[i + 1] === '*' || expression[i + 1] === '/')) {
                return "Expression contains streak operator!";
            }
        }
        return expression;
    }
}

