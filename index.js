import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/* this code:
- lets you play a tic-tac-toe game
- indicates when a player has won
- stores the game history so you can view the game state at any move that was made
created with reference to the React JS tutorial 
*/

// the Square components are now Controlled Components and the Board has full control over them
// vs
// function components: components that only contain a render method and don't have their own state
/*
class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        // when clicked, the square will now contain an X: calling this.setState from an onClick handler tells react to re-render that Square whenever its <button> is clicked
        onClick={() => this.props.onClick()}>
        {
          // displays what each square contains
          this.props.value
        }
      </button>
    );
  }
}
*/
function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}>
        {props.value}
      </button>
  );
}

// Info flows in React from Parents to Children: Board is the parent component and Square is the child component

// store the game's state in the parent Board component and pass a prop to tell each Square what to display
// Note: state is private to the component that defines it
class Board extends React.Component {
  renderSquare(i) {
    // passing down 2 props from Board to Square: value and onClick
    //  onClick is a function that Square can call when clicked
    return (
    <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
     );
  }

  render() {
    return (
      <div>
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

// the top-level game component will display a list of past moves
// the Board component will receive squares and onClick props from the Game component
class Game extends React.Component {
  constructor(props) {
    // we always need to call super when defining the ctor of a subclass in javascript
    //   thus, all React component classes w/ a ctor should start with a super(props) call
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true, //bool to tell whos turn it is
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // .slice() means to create a copy of the squares array to modify => Immutability so we can retain previous versions of the game's history
    const squares = current.squares.slice();
    // return early if someone won or if a Square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      // concat doesn't mutate the original array
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      // history is not updated here so it is left as is
      stepNumber: step, 
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    // map the history of moves to React elements representing buttons on the screen to jump to past moves
    const moves = history.map((step, move) => {
      // step refers to the current history element value and move is the current history element index
      const desc = move ? 
            'Go to move #' + move : 
            'Go to game start';
      return (
        //each child in an array/iterator should have a unique "key" prop so the computer knows what to update
        <li key={move}>
          <button onClick={() =>
        this.jumpTo(move)}>{desc}</button>
         </li>
        );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
