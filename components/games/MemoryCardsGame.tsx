import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart, Diamond, Circle, Square, Triangle } from 'lucide-react';

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

interface GameCard {
  id: number;
  symbol: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryCardsGame({ customizations, onScoreChange }: GameProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const gridSize = customizations.difficulty === 'easy' ? 8 : customizations.difficulty === 'medium' ? 12 : 16;
  const symbols = [Star, Heart, Diamond, Circle, Square, Triangle];

  const initializeGame = () => {
    const pairs = gridSize / 2;
    const gameCards: GameCard[] = [];
    
    for (let i = 0; i < pairs; i++) {
      const symbol = i % symbols.length;
      gameCards.push(
        { id: i * 2, symbol, isFlipped: false, isMatched: false },
        { id: i * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    }
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameWon) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(prev => {
            const newMatched = prev + 1;
            if (newMatched === gridSize / 2) {
              setGameWon(true);
              onScoreChange?.(Math.max(100 - moves, 10));
            }
            return newMatched;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    initializeGame();
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
    return schemes[customizations.colorScheme as keyof typeof schemes] || schemes.blue;
  };

  const renderSymbol = (symbolIndex: number) => {
    const Symbol = symbols[symbolIndex];
    return <Symbol className="w-6 h-6 text-white" />;
  };

  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, [gameStarted, gridSize]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Memory Cards</h3>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span>Moves: {moves}</span>
            <span>Pairs: {matchedPairs}/{gridSize / 2}</span>
            <span className="capitalize">{customizations.difficulty}</span>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Find matching pairs by flipping cards!</p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            {gameWon && (
              <div className="text-center mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-800">
                  Congratulations! You won in {moves} moves!
                </p>
              </div>
            )}

            <div 
              className={`grid gap-2 mb-4 mx-auto`}
              style={{ 
                gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, 1fr)`,
                maxWidth: '300px'
              }}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-300
                    flex items-center justify-center
                    ${card.isFlipped || card.isMatched 
                      ? `${getColorClass()} border-transparent` 
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                    }
                    ${customizations.theme === 'retro' ? 'rounded-none border-black' : ''}
                    ${customizations.theme === 'neon' ? 'shadow-lg' : ''}
                    ${card.isMatched ? 'opacity-60' : ''}
                    hover:scale-105 active:scale-95
                  `}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
                >
                  {(card.isFlipped || card.isMatched) && renderSymbol(card.symbol)}
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
                New Game
              </Button>
              {gameWon && (
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