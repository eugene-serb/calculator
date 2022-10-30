# Calculator
Calculator in ***JavaScript*** and ***HTML*** with ***CSS*** **[[rep](https://github.com/eugene-serb/calculator), [site](https://eugene-serb.github.io/calculator/)]**. 

There is a few files:
1. ***index.html***
2. ***calculator.css***
3. ***calculator.js***

I guess that no need to describe for what ***index.html***, but so this is just a calculator form. Includes a display and a keyboard;
<br /> Also as for first, ***style.css*** is styles for calculator form, display and keyboard;
<br /> ***calculator.js*** is a script file that containing two classes: an interface class and a calculator class.

For use calculator class in ***calculator.js*** separately from this project, you need use it like in example:

```js
const calculator = new Calculator();
let expression = "-6 + (4.5 * 8 / 2 + 2) - 4.7";
let result = calculator.solve(expression);
console.log(result);
```

Class calculator contains an expression validator and a calculator that can decide any expressions like above.

If the expression hasn't contains a valid expression or in process of calculating it turns out that this contains division by zero, consequently this returns an error in string type.

Yes, interface class no work good and need to be recoded for correctly building expression. Yes, calculator class too no work good and need to be recoded and, so, can be just replaced eval function, but will be writted by for learn JavaScript and HTML with CSS.

If you are interested in this or my other projects, or would like to suggest and share ideas with me, or just talk to me, contact me: *[@eugene_serb](https://t.me/eugene_serb)*
