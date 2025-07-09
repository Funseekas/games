import React, { useState, useEffect, useCallback } from 'react';
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

interface Cell {
  id: string;
  color: number;
  row: number;
  col: number;
  selected: boolean;
}

export default function MatchThreeGame({ customizations, onScoreChange }: GameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [score, setScore] = useState(0);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gridSize = customizations.difficulty === 'easy' ? 6 : customizations.difficulty === 'medium' ? 8 : 10;
  const colors = 5;

  const getColorClass = (colorIndex: number) => {
    const schemes = {
      blue: ['bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700'],
      green: ['bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700'],
      purple: ['bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700'],
      red: ['bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700'],
      orange: ['bg-orange-300', 'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700'],
      pink: ['bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700'],
    };
    return schemes[customizations.colorScheme as keyof typeof schemes][colorIndex] || schemes.blue[colorIndex];
  };

  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
      const gridRow: Cell[] = [];
      for (let col = 0; col < gridSize; col++) {
        gridRow.push({
          id: `${row}-${col}`,
          color: Math.floor(Math.random() * colors),
          row,
          col,
          selected: false,
        });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
  }, [gridSize]);

  const findMatches = useCallback((currentGrid: Cell[][]) => {
    const matches: string[] = [];
    
    // Check horizontal matches
    for (let row = 0; row < gridSize; row++) {
      let count = 1;
      let currentColor = currentGrid[row][0].color;
      for (let col = 1; col < gridSize; col++) {
        if (currentGrid[row][col].color === currentColor) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.push(`${row}-${i}`);
            }
          }
          count = 1;
          currentColor = currentGrid[row][col].color;
        }
      }
      if (count >= 3) {
        for (let i = gridSize - count; i < gridSize; i++) {
          matches.push(`${row}-${i}`);
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < gridSize; col++) {
      let count = 1;
      let currentColor = currentGrid[0][col].color;
      for (let row = 1; row < gridSize; row++) {
        if (currentGrid[row][col].color === currentColor) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.push(`${i}-${col}`);
            }
          }
          count = 1;
          currentColor = currentGrid[row][col].color;
        }
      }
      if (count >= 3) {
        for (let i = gridSize - count; i < gridSize; i++) {
          matches.push(`${i}-${col}`);
        }
      }
    }

    return [...new Set(matches)];
  }, [gridSize]);

  const removeMatches = useCallback((matches: string[]) => {
    if (matches.length === 0) return;

    setIsAnimating(true);
    const newScore = score + matches.length * 10;
    setScore(newScore);
    onScoreChange?.(newScore);

    setTimeout(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        
        // Remove matched cells
        matches.forEach(cellId => {
          const [row, col] = cellId.split('-').map(Number);
          newGrid[row][col].color = -1; // Mark as empty
        });

        // Drop cells down
        for (let col = 0; col < gridSize; col++) {
          const column = [];
          for (let row = gridSize - 1; row >= 0; row--) {
            if (newGrid[row][col].color !== -1) {
              column.push(newGrid[row][col]);
            }
          }
          
          // Fill from bottom
          for (let row = gridSize - 1; row >= 0; row--) {
            if (column.length > 0) {
              newGrid[row][col] = { ...column.shift()!, row, col, id: `${row}-${col}` };
            } else {
              newGrid[row][col] = {
                id: `${row}-${col}`,
                color: Math.floor(Math.random() * colors),
                row,
                col,
                selected: false,
              };
            }
          }
        }

        return newGrid;
      });
      setIsAnimating(false);
    }, 300);
  }, [score, onScoreChange, gridSize]);

  const handleCellClick = (cellId: string) => {
    if (isAnimating || !gameStarted) return;

    const [row, col] = cellId.split('-').map(Number);
    
    if (selectedCells.length === 0) {
      setSelectedCells([cellId]);
      setGrid(prev => prev.map(row => 
        row.map(cell => ({ ...cell, selected: cell.id === cellId }))
      ));
    } else if (selectedCells.length === 1) {
      const [selectedRow, selectedCol] = selectedCells[0].split('-').map(Number);
      const isAdjacent = Math.abs(row - selectedRow) + Math.abs(col - selectedCol) === 1;
      
      if (isAdjacent) {
        // Swap cells
        setGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          const temp = newGrid[row][col].color;
          newGrid[row][col].color = newGrid[selectedRow][selectedCol].color;
          newGrid[selectedRow][selectedCol].color = temp;
          
          // Check for matches after swap
          const matches = findMatches(newGrid);
          if (matches.length > 0) {
            setTimeout(() => removeMatches(matches), 100);
          }
          
          return newGrid.map(row => 
            row.map(cell => ({ ...cell, selected: false }))
          );
        });
      }
      
      setSelectedCells([]);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    initializeGrid();
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setSelectedCells([]);
    setGrid([]);
  };

  useEffect(() => {
    if (!gameStarted) {
      initializeGrid();
    }
  }, [initializeGrid, gameStarted]);

  // Auto-check for matches periodically
  useEffect(() => {
    if (!gameStarted || isAnimating) return;
    
    const interval = setInterval(() => {
      const matches = findMatches(grid);
      if (matches.length > 0) {
        removeMatches(matches);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [grid, gameStarted, isAnimating, findMatches, removeMatches]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Match Three</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Score: {score}</span>
            <span className="text-sm text-gray-600 capitalize">
              {customizations.difficulty} Mode
            </span>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Match 3 or more gems in a row!</p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            <div 
              className={`grid gap-1 mb-4 mx-auto`}
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: '300px'
              }}
            >
              {grid.flat().map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={isAnimating}
                  className={`
                    aspect-square rounded-sm transition-all duration-200 border-2
                    ${getColorClass(cell.color)}
                    ${cell.selected ? 'border-yellow-400 scale-110' : 'border-transparent'}
                    ${customizations.theme === 'retro' ? 'border-black' : ''}
                    ${customizations.theme === 'neon' ? 'shadow-lg' : ''}
                    hover:scale-105 active:scale-95
                    ${isAnimating ? 'opacity-70' : ''}
                  `}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetGame} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Reset
              </Button>
              <Button 
                onClick={() => {
                  const matches = findMatches(grid);
                  if (matches.length > 0) removeMatches(matches);
                }} 
                size="sm" 
                className="flex-1"
                disabled={isAnimating}
              >
                Check Matches
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}