import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// square functional component is controlled by the Board component - child component of the Board
const Square = props => {
  return (
    // onClick props function passed down from Board component - just returns the square's value from parent props.
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  // render square function used to pass down props to Square child component
  renderSquare(i) {
    return (
      // Square child component
      <Square
        //square value
        value={this.props.squares[i]}
        // onClick function 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {/* board rendered */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    // Game state that holds the board & square states. Each user move will be captured and a "state" of the board will be captured in "history" to log each user's move until there is a winner. 
    this.state = {
      // state that captures the "state" of the board after each user move. Every square starts off as null.
      // users will input an X or O as their move and update the square's state.
      history: [
        {
        // the board - starts off as every square state of null
          squares: Array(9).fill(null)
        }
      ],
      // the current step in the game, in number form. Default is zero for start, and each user move adds 1.
      stepNumber: 0,
      // boolean to determine if user X or O is next. Default (true) is X.
      xIsNext: true
    };
  }

  // function that updates state after a square is clicked on the board. 
  // Also has logic to return if a user has won the game. 
  handleClick(i) {
    // variable grabs history state at exact moment (after each user play). (null, X, O are 3 possible states).
    // Slice creates copy of each object within the array - this gives the TOTAL snapshot of the history array after each play. This is the "STATE" of the board at that moment.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // current is the last iteration of the array (the most recent user play)
    const current = history[history.length - 1];
    // square variable is the slice of the last board play 
    const squares = current.squares.slice();
    // logic used to return early if the a user has won or if clicked square was already played (state is NOT null).
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // square variable at i is looking to check if X or O user is up for next turn (ternary expression)
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      // setting state (replacing null with X or O) based off above ternary statement.
      // concat used rather than push because it does not mutate array.
      history: history.concat([
        {
          // square that user clicked within the board updated with X or O from above.
          squares: squares
        }
      ]),
      // step number increases after every user play (this is determined by length of total history array)
      stepNumber: history.length,
      // T/F boolean to switch between X & O user.
      xIsNext: !this.state.xIsNext
    });
  }

  // function used to move backwards in game
  jumpTo(step) {
    this.setState({
      // parameter input is move clicked on by user
      // step is captured and updarted in state
      stepNumber: step,
      // checks to see if step was for user X or O - (affects boolean T/F)
      xIsNext: (step % 2) === 0
    });
  };

  // this is rendering to the page
  render() {
    // renders the board at that exact snapshot in time.
    const history = this.state.history;
    // shows the current step number in the board game.
    const current = history[this.state.stepNumber];
    // used for when a winner is determined.
    const winner = calculateWinner(current.squares);

    // tracking moves within the game. 
    // this is to allow users to move backwards within history
    // loop over the array
    const moves = history.map((step, move) => {
      // print out the move at that moment and capture it in a variable
      // default if no move is Go To Game Start - ternary expression.
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        // key used to help React ID which items are added, removed or changed within the application. 
        // keys should be given to the elements inside the array to give elements a unique identity. 
        <li key={move}>
          {/* button click rendered to page. user click triggers jumpTo() function to move user back to that moment of the game. */}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // code helps announce winner - status variable, then mutated to alert next user move or announce winner.
    let status;
    if (winner) {
      status = "Winner " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* renders the current squares on the board. Re-renders after each user click from onClick function (either user X or O) */}
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          {/* renders status of game */}
          <div>{status}</div>
          {/* renders each user X & O move */}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// logic to calculate game winner
const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
