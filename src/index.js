import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Square from './components/square';
import MoveList from './components/move-list';
import Status from './components/status';
import ResetButton from './components/reset-button';


class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  nextPlayer() {
    if (this.state.xIsNext){
      return {sign: 'X', color: 'green'}
    } else {
      return {sign: 'O', color: 'red'}
    }
  }

  currentSquares() {
    return this.state.history[this.state.stepNumber].squares;
  }

  handleClick(i) {
    const squares = this.currentSquares().slice();
    if (this.calculateWinner(squares) || squares[i]) {
        return;
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    squares[i] = this.nextPlayer().sign;
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  calculateWinner() {
    const squares = this.currentSquares();
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  resetGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Status winner={this.calculateWinner()} nextPlayer={this.nextPlayer()} />
          <Board squares={this.currentSquares()} onClick={(i) => this.handleClick(i)} />
          <ResetButton onReset={() => this.resetGame()} />
        </div>
        <div className="game-info">
          <MoveList history={this.state.history}
                    onClick={(move) => this.jumpTo(move)}
                    stepNumber={this.state.stepNumber} />
        </div>
      </div>
    );
  }
}


ReactDOM.render(<Game />, document.querySelector('.container') );
