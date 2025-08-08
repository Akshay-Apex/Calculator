let display = document.querySelector('.display');
let expression = "";
let memory = 0;

// Updates the screen with the value, otherwise to "0"
function showDisplay(value) {
  display.textContent = value ? value : "0";
}

// Converts operators to eval compatible operators
function convertMathSymbols(str) {
  return str.replace(/×/g, "*").replace(/÷/g, "/");
}

// Checks if the parentheses are balanced
function checkBrackets(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') count++;
    if (str[i] === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

let buttons = document.querySelectorAll('.buttons button');

buttons.forEach(button => {
  button.addEventListener('click', function() {
    let id = this.id;
    let txt = this.textContent;

    switch (id) {
      case "equals":
        if (expression.length === 0) return;
        try {
          if (checkBrackets(expression)) {
            let toEval = convertMathSymbols(expression);
            let ans = eval(toEval);
            expression = ans.toString();
            showDisplay(expression);
          } else {
            showDisplay("Error");
            expression = "";
          }
        } catch (e) {
          showDisplay("Error");
          expression = "";
        }
        break;

      case "ac":
        expression = "";
        showDisplay(expression);
        break;

      case "ce":
        expression = expression.slice(0, -1);
        showDisplay(expression);
        break;

      case "dot":
        // Prevent multiple dots in the same number segment       
        let afterOperator = /[+\-\×\÷\(]$/.test(expression);

        // Only add a decimal if the current number doesn't have one
        if (!/\.\d*$/.test(expression.split(/[+\-\×\÷\(\)]/).pop())) {
            expression += (afterOperator || expression === "") ? "0." : ".";
        }

        showDisplay(expression);
        break;

      case "plus":
      case "minus":
      case "mul":
      case "div":
        // Prevent multiple consecutive operators
        if (expression !== "" && !/[+\-\×\÷]$/.test(expression)) {
          expression += txt;
        }
        // Allow minus at the start for negative numbers
        if (expression === "" && id === "minus") {
          expression += "-";
        }
        showDisplay(expression);
        break;

      case "opening-bracket":
        if (expression === "" || /[+\-\×\÷(]$/.test(expression)) {
          expression += "(";
        }
        showDisplay(expression);
        break;

      case "closing-bracket":
        // Add closing bracket only when currently balanced and last char is valid
        let opens = (expression.match(/\(/g) || []).length;
        let closes = (expression.match(/\)/g) || []).length;
        if (opens > closes && /[0-9.)]$/.test(expression)) {
          expression += ")";
        }
        showDisplay(expression);
        break;

      case "m-plus":
        if (expression !== "") {
          try {
            let toEval = convertMathSymbols(expression);
            let memAdd = eval(toEval);
            memory += Number(memAdd);
          } catch (e) {}
        }
        break;

      case "m-minus":
        if (expression !== "") {
          try {
            let toEval = convertMathSymbols(expression);
            let memMinus = eval(toEval);
            memory -= Number(memMinus);
          } catch (e) {}
        }
        break;

      case "mr":
        // Recall memory, insert at valid positions
        if (expression === "" || /[+\-\×\÷(]$/.test(expression)) {
          expression += memory.toString();
        } else if (/[0-9)]$/.test(expression)) {
          expression += "+" + memory.toString();
        }
        showDisplay(expression);
        break;

      case "mc":
        memory = 0;
        break;

      default:
        // Handle digits and "00", restrict 00 at invalid positions
        if (id === "00") {
          if (expression === "" || /[+\-\×\÷(]$/.test(expression)) {
            expression += "0";
          } else {
            expression += "00";
          }
        } else {
          // Prevent numbers directly after closing bracket
          if (!expression || !/\)$/.test(expression)) {
            expression += txt;
          }
        }
        showDisplay(expression);
        break;
    }
  });
});

// Initialize display on load
showDisplay("");
