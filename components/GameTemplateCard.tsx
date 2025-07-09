import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  Type, 
  Calculator, 
  Palette, 
  Brain, 
  Puzzle, 
  HelpCircle, 
  Zap, 
  X, 
  Circle, 
  Search, 
  Shield 
} from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface GameTemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

export default function GameTemplateCard({ template, isSelected, onClick }: GameTemplateCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGamePreview = () => {
    switch (template.name) {
      case 'Match Three':
        return (
          <div className="grid grid-cols-3 gap-1 p-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  [0, 4, 8].includes(i) ? 'bg-red-400' :
                  [1, 3, 5].includes(i) ? 'bg-blue-400' : 'bg-green-400'
                }`}
              />
            ))}
          </div>
        );

      case 'Word Puzzle':
        return (
          <div className="p-3 space-y-1">
            <div className="grid grid-cols-5 gap-1">
              {['W', 'O', 'R', 'D', 'S'].map((letter, i) => (
                <div key={i} className="aspect-square bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">{letter}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {['P', 'U', 'Z', 'Z', 'L'].map((letter, i) => (
                <div key={i} className="aspect-square bg-green-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800">{letter}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Number Grid':
        return (
          <div className="grid grid-cols-3 gap-1 p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, ''].map((num, i) => (
              <div
                key={i}
                className={`aspect-square rounded flex items-center justify-center text-xs font-bold ${
                  num ? 'bg-purple-100 text-purple-800' : 'bg-gray-200'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        );

      case 'Color Match':
        return (
          <div className="grid grid-cols-4 gap-1 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-full ${
                  i % 4 === 0 ? 'bg-red-400' :
                  i % 4 === 1 ? 'bg-blue-400' :
                  i % 4 === 2 ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              />
            ))}
          </div>
        );

      case 'Memory Cards':
        return (
          <div className="grid grid-cols-4 gap-1 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded flex items-center justify-center ${
                  [0, 3, 4, 7].includes(i) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                {[0, 3, 4, 7].includes(i) && (
                  <span className="text-white text-xs">★</span>
                )}
              </div>
            ))}
          </div>
        );

      case 'Puzzle Slide':
        return (
          <div className="grid grid-cols-3 gap-1 p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, ''].map((num, i) => (
              <div
                key={i}
                className={`aspect-square rounded flex items-center justify-center text-xs font-bold ${
                  num ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-gray-100'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        );

      case 'Quiz Master':
        return (
          <div className="p-3 space-y-2">
            <div className="h-2 bg-blue-200 rounded-full">
              <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-200 rounded w-full"></div>
              <div className="h-1 bg-green-400 rounded w-2/3"></div>
              <div className="h-1 bg-gray-200 rounded w-3/4"></div>
              <div className="h-1 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'Snake Game':
        return (
          <div className="relative p-2">
            <div className="grid grid-cols-8 gap-px">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    [18, 19, 20, 28, 36].includes(i) ? 'bg-green-500' :
                    i === 45 ? 'bg-red-400' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        );

      case 'Tic Tac Toe':
        return (
          <div className="grid grid-cols-3 gap-1 p-3">
            {['X', '', 'O', '', 'X', '', 'O', '', 'X'].map((symbol, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center"
              >
                <span className={`text-lg font-bold ${
                  symbol === 'X' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {symbol}
                </span>
              </div>
            ))}
          </div>
        );

      case 'Bubble Pop':
        return (
          <div className="p-2">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-full ${
                    i % 6 === 0 ? 'bg-red-400' :
                    i % 6 === 1 ? 'bg-blue-400' :
                    i % 6 === 2 ? 'bg-green-400' :
                    i % 6 === 3 ? 'bg-yellow-400' :
                    i % 6 === 4 ? 'bg-purple-400' : 'bg-pink-400'
                  } ${i > 17 ? 'opacity-30' : ''}`}
                />
              ))}
            </div>
          </div>
        );

      case 'Word Search':
        return (
          <div className="p-2">
            <div className="grid grid-cols-6 gap-px text-xs">
              {['C', 'A', 'T', 'X', 'Y', 'Z', 'O', 'B', 'I', 'R', 'D', 'M', 'W', 'X', 'N', 'E', 'T', 'S', 'Q', 'R', 'S', 'U', 'N', 'P', 'L', 'M', 'K', 'J', 'H', 'G'].map((letter, i) => (
                <div
                  key={i}
                  className={`aspect-square bg-gray-100 flex items-center justify-center font-mono ${
                    [0, 1, 2, 6, 10].includes(i) ? 'bg-yellow-200 text-yellow-800' : 'text-gray-600'
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        );

      case 'Tower Defense':
        return (
          <div className="p-2 relative">
            <div className="grid grid-cols-6 gap-px">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    [6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23].includes(i) ? 'bg-green-200' :
                    [0, 12, 24].includes(i) ? 'bg-blue-500' :
                    [5, 17, 29].includes(i) ? 'bg-red-400' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md flex items-center justify-center">
            <Grid3X3 className="w-8 h-8 text-white" />
          </div>
        );
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="w-full h-20 bg-white border border-gray-200 rounded-md mb-3 overflow-hidden">
          {renderGamePreview()}
        </div>
        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{template.description}</p>
        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
          {template.difficulty}
        </Badge>
      </CardContent>
    </Card>
  );
}