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

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame({ customizations, onScoreChange }: GameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gridSize = 20;
  const gameSpeed = customizations.difficulty === 'easy' ? 200 : customizations.difficulty === 'medium' ? 150 : 100;

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange?.(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, gameOver, score, generateFood, onScoreChange]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
        break;
    }
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };

  const getColorClass = () => {
    const schemes = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
    };
    return schemes[customizations.colorScheme as keyof typeof schemes] || schemes.green;
  };

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Snake Game</h3>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>Score: {score}</span>
            <span>Length: {snake.length}</span>
            <span className="capitalize">{customizations.difficulty}</span>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Use arrow keys to control the snake!</p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            {gameOver && (
              <div className="text-center mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-800">
                  Game Over! Final Score: {score}
                </p>
              </div>
            )}

            <div 
              className={`
                grid gap-px mb-4 mx-auto bg-gray-300 p-1
                ${customizations.theme === 'retro' ? 'border-4 border-black' : 'rounded-lg'}
                ${customizations.theme === 'neon' ? 'shadow-lg border border-blue-400' : ''}
              `}
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: '300px',
                height: '300px'
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                const isFood = food.x === x && food.y === y;
                const isHead = snake[0]?.x === x && snake[0]?.y === y;

                return (
                  <div
                    key={index}
                    className={`
                      aspect-square
                      ${isSnake 
                        ? `${getColorClass()} ${isHead ? 'opacity-100' : 'opacity-80'}` 
                        : isFood 
                          ? 'bg-red-500' 
                          : 'bg-gray-100'
                      }
                      ${customizations.theme === 'retro' ? '' : 'rounded-sm'}
                    `}
                  />
                );
              })}
            </div>

            <div className="text-center mb-4 text-sm text-gray-600">
              Use arrow keys to move
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
              {gameOver && (
                <Button 
                  onClick={startGame} 
                  size="sm" 
                  className="flex-1"
                >
                  Play Again
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}