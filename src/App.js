import React from "react";
import "./style.css";

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className="calcButton" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  renderButton(i, type) {
    return (
      <Button
        value={i}
        type={type}
        onClick={() => this.props.onClick(i, type)}
      />
    );
  }

  render() {
    return (
      <div className="grid">
        <div className="calc-row">
          {this.renderButton(7, "operand")}
          {this.renderButton(8, "operand")}
          {this.renderButton(9, "operand")}
          {this.renderButton("C", "operator")}
        </div>
        <div className="calc-row">
          {this.renderButton(4, "operand")}
          {this.renderButton(5, "operand")}
          {this.renderButton(6, "operand")}
          {this.renderButton("CE", "operator")}
        </div>
        <div className="calc-row">
          {this.renderButton(1, "operand")}
          {this.renderButton(2, "operand")}
          {this.renderButton(3, "operand")}
          {this.renderButton("=", "operator")}
        </div>
        <div className="calc-row">
          {this.renderButton(0, "operand")}
          {this.renderButton("(", "operand")}
          {this.renderButton(")", "operand")}
        </div>
        <div className="calc-row">
          {this.renderButton("+", "operator")}
          {this.renderButton("-", "operator")}
          {this.renderButton("*", "operator")}
          {this.renderButton("/", "operator")}
        </div>
      </div>
    );
  }
}

class Screen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="screen">{this.props.input}</div>;
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }

  handleClick(i, type) {
    var inputString = this.state.input;
    if (type === "operand") {
      if (this.state.input != null) {
        inputString = this.state.input + "" + i;
      } else {
        inputString = i;
      }
    } else {
      if (this.state.input != null) {
        if (i === "C") {
          inputString = null;
        }
        if (i === "CE") {
          inputString = inputString.slice(0, -1);
        }
        if (i === "+" || i === "-" || i === "*" || i === "/") {
          inputString = this.state.input + "" + i;
        }
        if (i === "=") {
          inputString = this.evaluateExpression(inputString);
          console.log(inputString);
        }
      }
    }
    this.setState({ input: inputString });
  }

  evaluateExpression(inputString) {
    console.log(inputString);
    var expr = inputString;
    var operands = [];
    var operators = [];

    for (var i = 0; i < expr.length; i++) {
      var top = operators[operators.length - 1];
      var valTop = operands[operands.length - 1];
      var c = expr.charAt(i);

      if (c === " ") {
        continue;
      } else if (c >= "0" && c <= "9") {
        var value = "";
        while (c >= "0" && c <= "9") {
          value += c;
          i++;
          c = expr.charAt(i);
        }
        i--;
        value += " ";
        operands.push(value);
      } else if (c === "(") {
        operators.push(c);
      } else if (c === ")") {
        while (top !== "(") {
          operands.push(
            this.evaluate(operators.pop(), operands.pop(), operands.pop())
          );

          valTop = operands[operands.length - 1];
          if (valTop === null) {
            return null;
          }
          top = operators[operators.length - 1];
        }
        operators.pop();
      } else if (c === "+" || c === "-" || c === "*" || c === "/") {
        while (
          operators.length !== 0 &&
          this.priority(c) <= this.priority(top)
        ) {
          operands.push(
            this.evaluate(operators.pop(), operands.pop(), operands.pop())
          );

          valTop = operands[operands.length - 1];
          if (valTop === null) {
            return null;
          }
        }
        operators.push(c);
      }
    }
    while (operators.length !== 0) {
      operands.push(
        this.evaluate(operators.pop(), operands.pop(), operands.pop())
      );

      valTop = operands[operands.length - 1];
      if (valTop === null) {
        return null;
      }
    }

    return operands.pop();
  }

  evaluate(operator, b, a) {
    switch (operator) {
      case "+":
        return +a + +b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        if (b === 0) {
          return null;
        }
        return a / b;
      default:
        return 0;
    }
  }

  priority(c) {
    switch (c) {
      case "+":
      case "-":
        return 1;
      case "*":
      case "/":
        return 2;
      default:
        return -1;
    }
  }

  render() {
    return (
      <div className="calc">
        <div className="calc-screen">
          <Screen input={this.state.input} />
        </div>
        <div className="calc-buttons">
          <Grid onClick={(i, type) => this.handleClick(i, type)} />
        </div>
      </div>
    );
  }
}

export default Calculator;
