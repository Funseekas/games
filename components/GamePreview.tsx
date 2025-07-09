import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Star, Zap, Volume2, Trophy, Target } from 'lucide-react';

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
  
  const getColorSchemeClasses = (scheme: string) => {
    switch (scheme) {
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'red': return 'from-red-400 to-red-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'modern':
        return 'rounded-xl shadow-lg border-2 border-gray-200';
      case 'retro':
        return 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      case 'neon':
        return 'rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400';
      default:
        return 'rounded-lg shadow-md border border-gray-300';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderGameGrid = () => {
    // Create a sample game grid based on the selected template
    const gridSize = selectedTemplateData?.name.includes('Grid') ? 6 : 4;
    const cells = Array.from({ length: gridSize * gridSize });
    
    return (
      <div 
        className={`grid gap-1 p-4 ${
          gridSize === 6 ? 'grid-cols-6' : 'grid-cols-4'
        }`}
        style={{ aspectRatio: '1' }}
      >
        {cells.map((_, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-sm transition-all duration-300
              bg-gradient-to-br ${getColorSchemeClasses(customizations.colorScheme)}
              ${customizations.theme === 'neon' ? 'shadow-[0_0_10px_rgba(59,130,246,0.3)]' : ''}
              ${customizations.theme === 'retro' ? 'border border-black' : ''}
              hover:scale-105 cursor-pointer
            `}
          >
            {/* Add some sample content based on template */}
            {selectedTemplateData?.name === 'Match Three' && index % 3 === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-80" />
              </div>
            )}
            {selectedTemplateData?.name === 'Memory Cards' && index % 4 === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white opacity-60" />
              </div>
            )}
            {selectedTemplateData?.name === 'Number Grid' && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-xs font-bold opacity-80">
                  {(index % 9) + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`h-full ${getThemeStyles(customizations.theme)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold truncate">
            {gameName || 'Your Game'}
          </CardTitle>
          <div className="flex items-center gap-1">
            {getDifficultyStars(customizations.difficulty)}
          </div>
        </div>
        {selectedTemplateData && (
          <p className="text-sm text-gray-600 truncate">
            {selectedTemplateData.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Game Area */}
        <div className={`
          mx-4 mb-4 rounded-lg overflow-hidden
          ${customizations.theme === 'retro' ? 'bg-black' : 'bg-gray-100'}
          ${customizations.theme === 'neon' ? 'bg-gray-900' : ''}
        `}>
          {selectedTemplateData ? (
            renderGameGrid()
          ) : (
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Gamepad2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a template to preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Game UI Elements */}
        <div className="px-4 pb-4 space-y-3">
          {/* Score and Level */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Score: 1,250</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Level 3</span>
            </div>
          </div>

          {/* Feature Indicators */}
          <div className="flex flex-wrap gap-2">
            {customizations.soundEnabled && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                <Volume2 className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-700">Sound</span>
              </div>
            )}
            {customizations.powerUps && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                <Zap className="w-3 h-3 text-yellow-600" />
                <span className="text-xs text-yellow-700">Power-ups</span>
              </div>
            )}
            {customizations.features.includes('leaderboard') && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <Trophy className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700">Leaderboard</span>
              </div>
            )}
            {customizations.features.includes('achievements') && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                <Star className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-700">Achievements</span>
              </div>
            )}
          </div>

          {/* Theme Preview Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 capitalize">
              {customizations.theme} Theme • {customizations.colorScheme} Colors
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}