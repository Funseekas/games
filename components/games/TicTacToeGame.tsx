import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Circle } from 'lucide-react';

interface GameProps {
  customizations: {
    theme: string;
    difficulty: string;
    colorScheme: string;
    soundEnabled: boolean;
    powerUps: boolean;
  };
  onScoreChange?: (score: number) => void;
}

type Player = 'X' | 'O' | null;

export default function TicTacToeGame({ customizations, onScoreChange }: GameProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (newBoard: Player[]) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return newBoard.every(cell => cell !== null) ? 'draw' : null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult as Player);
      if (gameResult === 'draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setScores(prev => ({ 
          ...prev, 
          [gameResult]: prev[gameResult as 'X' | 'O'] + 1 
        }));
        onScoreChange?.(scores[gameResult as 'X' | 'O'] + 1);
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const getColorClass = () => {
    const schemes = {
      blue: 'border-blue-500 hover:bg-blue-50',
      green: 'border-green-500 hover:bg-green-50',
      purple: 'border-purple-500 hover:bg-purple-50',
      red: 'border-red-500 hover:bg-red-50',
      orange: 'border-orange-500 hover:bg-orange-50',
      pink: 'border-pink-500 hover:bg-pink-50',
    };
    return schemes[customizations.colorScheme as keyof typeof schemes] || schemes.blue;
  };

  const renderIcon = (player: Player) => {
    if (player === 'X') {
      return <X className={`w-8 h-8 ${customizations.colorScheme === 'red' ? 'text-red-600' : 'text-blue-600'}`} />;
    }
    if (player === 'O') {
      return <Circle className={`w-8 h-8 ${customizations.colorScheme === 'blue' ? 'text-red-600' : 'text-green-600'}`} />;
    }
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Tic Tac Toe</h3>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>X: {scores.X}</span>
            <span>Draws: {scores.draws}</span>
            <span>O: {scores.O}</span>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Get three in a row to win!</p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            {!winner && (
              <div className="text-center mb-4">
                <p className="text-lg font-medium">
                  Current Player: {renderIcon(currentPlayer)}
                </p>
              </div>
            )}

            {winner && (
              <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-800">
                  {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => makeMove(index)}
                  className={`
                    aspect-square border-2 rounded-lg flex items-center justify-center
                    transition-all duration-200 ${getColorClass()}
                    ${customizations.theme === 'retro' ? 'border-black rounded-none' : ''}
                    ${customizations.theme === 'neon' ? 'shadow-lg border-blue-400' : ''}
                    ${cell ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                    active:scale-95
                  `}
                  disabled={!!cell || !!winner}
                >
                  {renderIcon(cell)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetGame} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                New Round
              </Button>
              <Button 
                onClick={() => {
                  setGameStarted(false);
                  setScores({ X: 0, O: 0, draws: 0 });
                  resetGame();
                }} 
                size="sm" 
                className="flex-1"
              >
                Reset All
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}