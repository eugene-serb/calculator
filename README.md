# calculator
Calculator **[[rep](https://github.com/eugene-serb/calculator), [site](https://eugene-serb.github.io/resume/demos/calculator)]** on ***JavaScript*** and ***HTML with CSS***. 

There is a few files:
1. ***index.html***
2. ***style.css***
3. ***interface.js***
4. ***calculator.js***

I guess that no need to describe for what ***index.html***, but so this is just a calculator form. Includes a display and a keyboard;
<br /> Also as for first, ***style.css*** is styles for calculator form, display and keyboard;
<br /> ***interface.js*** is a script for replaces a standart action for a submit button to no reload page and handle a keyboard actions. Also, this is need to right handle actions on keyboard;
<br /> ***calculator.js*** is a calculator as just a class that can be used in any project. This is a primary file in project. This class can decide any expression. Contains a validator and calculator;

For use this class in ***calculator.js*** separately from this project, you need use it like in example:

```js
let calculator = new Calculator();
let decision = calculator.calculate(expression);
```

Where expression can be like this: «**-6 + (4.5 * 8 / 2 + 2) - 4.7**» ... <br />
Class calculator contains an expression validator and a calculator that can decide any expressions like above.

If the expression hasn't contains a valid expression or in process of calculating it turns out that this contains division by zero, consequently this returns an error in string type.

Yes, interface.js no work good and need to be recoded for correctly building expression. Yes, calculator.js can be just replaced eval() function, but will be writted by for learn JavaScript and HTML with CSS.

