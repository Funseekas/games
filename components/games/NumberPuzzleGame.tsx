import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

export default function NumberPuzzleGame({ customizations, onScoreChange }: GameProps) {
  const [tiles, setTiles] = useState<(number | null)[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const gridSize = customizations.difficulty === 'easy' ? 3 : customizations.difficulty === 'medium' ? 4 : 5;
  const totalTiles = gridSize * gridSize;

  const initializePuzzle = () => {
    const numbers = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    numbers.push(null); // Empty space
    
    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    setTiles(numbers);
    setMoves(0);
    setGameWon(false);
    setStartTime(Date.now());
  };

  const isSolved = (currentTiles: (number | null)[]) => {
    for (let i = 0; i < totalTiles - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[totalTiles - 1] === null;
  };

  const canMove = (index: number, emptyIndex: number) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleTileClick = (index: number) => {
    if (!gameStarted || gameWon) return;
    
    const emptyIndex = tiles.findIndex(tile => tile === null);
    if (canMove(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      
      setTiles(newTiles);
      setMoves(prev => prev + 1);
      
      if (isSolved(newTiles)) {
        setGameWon(true);
        const timeBonus = Math.max(100 - Math.floor((Date.now() - startTime) / 1000), 10);
        const moveBonus = Math.max(100 - moves, 10);
        const finalScore = timeBonus + moveBonus;
        onScoreChange?.(finalScore);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    initializePuzzle();
  };

  const resetGame = () => {
    setGameStarted(false);
    initializePuzzle();
  };

  const getColorClass = () => {
    const schemes = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      red: 'bg-red-500 hover:bg-red-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
    };
    return schemes[customizations.colorScheme as keyof typeof schemes] || schemes.blue;
  };

  useEffect(() => {
    if (!gameStarted) {
      initializePuzzle();
    }
  }, [gameStarted, gridSize]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Number Puzzle</h3>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>Moves: {moves}</span>
            <span className="capitalize">{customizations.difficulty} ({gridSize}x{gridSize})</span>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Arrange numbers in order by sliding tiles!</p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            {gameWon && (
              <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-800">
                  Puzzle Solved in {moves} moves!
                </p>
              </div>
            )}

            <div 
              className={`grid gap-2 mb-4 mx-auto p-4 bg-gray-100 rounded-lg`}
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: '300px'
              }}
            >
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200
                    flex items-center justify-center text-lg font-bold text-white
                    ${tile === null 
                      ? 'bg-transparent border-transparent cursor-default' 
                      : `${getColorClass()} border-transparent cursor-pointer hover:scale-105 active:scale-95`
                    }
                    ${customizations.theme === 'retro' ? 'rounded-none border-black' : ''}
                    ${customizations.theme === 'neon' ? 'shadow-lg' : ''}
                  `}
                  disabled={tile === null}
                >
                  {tile}
                </button>
              ))}
            </div>

            <div className="text-center mb-4 text-sm text-gray-600">
              Click tiles adjacent to the empty space to move them
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetGame} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                New Game
              </Button>
              <Button 
                onClick={initializePuzzle} 
                size="sm" 
                className="flex-1"
                disabled={!gameStarted}
              >
                Shuffle
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}