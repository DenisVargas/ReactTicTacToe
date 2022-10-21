import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//Controlled component by Board as a class
// class Square extends React.Component {
//     // constructor(props){
//     //     super(props);
//     //     this.state = {value:null}; //propiedad privada de Reac.Component
//     // }
//     render() {
//       return (
//         <button 
//             className="square" 
//             onClick={()=>{this.props.onClick();}}
//         >
//             {this.props.value}
//         </button>
//       );
//     }
// }
//Controlled component by Board as a function.
function Square(props){
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     }
    // }
    renderSquare(i) {
      return (<Square 
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}
      />); //Usa parentesis para evitar que se interte ';' al final y rompa el codigo.
    }
    render() {
        //const status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;  
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

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{squares:Array(9).fill(null),}],
            xIsNext:true,
            stepNumber:0,
        };
    }
    handleClick(squareIndex){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const newSquares = current.squares.slice(); //Slice() para crear una copia.
        if(calculateWinner(newSquares) || newSquares[squareIndex]) return;
        newSquares[squareIndex] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //concat() no muta el array original.
            history: history.concat([{squares:newSquares}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }
    jumpTo(step){
        //React merges only the properties mentioned.
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    render() {
        //Usamos el punto de la historia mas cercano.
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move)=>{
            const desc = move ? `Go to move #${move}` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) status = `The Winner is ${winner}`;
        else status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i)=> this.handleClick(i)}
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

/* ------------------------------------ - ----------------------------------- */
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