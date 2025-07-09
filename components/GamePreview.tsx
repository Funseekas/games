import React from 'react';
import MatchThreeGame from './games/MatchThreeGame';
import TicTacToeGame from './games/TicTacToeGame';
import MemoryCardsGame from './games/MemoryCardsGame';
import SnakeGame from './games/SnakeGame';
import NumberPuzzleGame from './games/NumberPuzzleGame';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface GamePreviewProps {
  gameName: string;
  selectedTemplate: number | null;
  customizations: {
    theme: string;
    difficulty: string;
    features: string[];
    colorScheme: string;
    soundEnabled: boolean;
    powerUps: boolean;
    multiplayer: boolean;
  };
  templates: Array<{
    id: number;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
}

export default function GamePreview({ 
  gameName, 
  selectedTemplate, 
  customizations, 
  templates 
}: GamePreviewProps) {
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  
  const renderGame = () => {
    if (!selectedTemplateData) return null;

    const gameProps = {
      customizations,
      onScoreChange: (score: number) => console.log('Score:', score)
    };

    switch (selectedTemplateData.name) {
      case 'Match Three':
        return <MatchThreeGame {...gameProps} />;
      case 'Tic Tac Toe':
        return <TicTacToeGame {...gameProps} />;
      case 'Memory Cards':
        return <MemoryCardsGame {...gameProps} />;
      case 'Snake Game':
        return <SnakeGame {...gameProps} />;
      case 'Number Grid':
      case 'Puzzle Slide':
        return <NumberPuzzleGame {...gameProps} />;
      default:
        return (
          <Card className="w-full">
            <CardContent className="p-8 text-center">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {selectedTemplateData.name} prototype coming soon!
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="w-full">
      {selectedTemplateData ? (
        renderGame()
      ) : (
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-600">Select a template to preview the game</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}