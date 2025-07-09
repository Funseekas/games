'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, ArrowRight, ArrowLeft, Check, Settings, Zap, Palette, Volume2, Star, Shield } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const templates: Template[] = [
  { id: 1, name: 'Match Three', description: 'Classic matching game', difficulty: 'Easy' },
  { id: 2, name: 'Word Puzzle', description: 'Letter arrangement game', difficulty: 'Medium' },
  { id: 3, name: 'Number Grid', description: 'Mathematical challenges', difficulty: 'Hard' },
  { id: 4, name: 'Color Match', description: 'Visual pattern game', difficulty: 'Easy' },
  { id: 5, name: 'Memory Cards', description: 'Flip and match pairs', difficulty: 'Medium' },
  { id: 6, name: 'Puzzle Slide', description: 'Sliding tile puzzle', difficulty: 'Hard' },
  { id: 7, name: 'Quiz Master', description: 'Multiple choice questions', difficulty: 'Easy' },
  { id: 8, name: 'Snake Game', description: 'Classic arcade style', difficulty: 'Medium' },
  { id: 9, name: 'Tic Tac Toe', description: 'Strategic placement game', difficulty: 'Easy' },
  { id: 10, name: 'Bubble Pop', description: 'Colorful bubble shooter', difficulty: 'Medium' },
  { id: 11, name: 'Word Search', description: 'Hidden word finder', difficulty: 'Easy' },
  { id: 12, name: 'Tower Defense', description: 'Strategic defense game', difficulty: 'Hard' },
];

export default function GameBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [gameName, setGameName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customizations, setCustomizations] = useState({
    theme: 'classic',
    difficulty: 'medium',
    features: [] as string[],
    colorScheme: 'blue',
    soundEnabled: true,
    powerUps: false,
    multiplayer: false,
  });

  const steps = [
    { id: 1, title: 'Name Your Game', icon: Gamepad2 },
    { id: 2, title: 'Choose Template', icon: Zap },
    { id: 3, title: 'Customize', icon: Settings },
    { id: 4, title: 'Publish', icon: Check },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    window.open('https://funseekas.com/donjazzy', '_blank');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return gameName.trim().length > 0;
      case 2:
        return selectedTemplate !== null;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

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

  const toggleFeature = (feature: string) => {
    setCustomizations(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const themes = [
    { id: 'classic', name: 'Classic', description: 'Traditional game look' },
    { id: 'modern', name: 'Modern', description: 'Sleek contemporary design' },
    { id: 'retro', name: 'Retro', description: 'Nostalgic pixel art style' },
    { id: 'neon', name: 'Neon', description: 'Vibrant glowing effects' },
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Forest Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
    { id: 'red', name: 'Fire Red', color: 'bg-red-500' },
    { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-500' },
    { id: 'pink', name: 'Bubblegum Pink', color: 'bg-pink-500' },
  ];

  const availableFeatures = [
    { id: 'leaderboard', name: 'Leaderboard', description: 'Track high scores' },
    { id: 'achievements', name: 'Achievements', description: 'Unlock rewards' },
    { id: 'tutorials', name: 'Tutorial Mode', description: 'Help new players' },
    { id: 'themes', name: 'Theme Variants', description: 'Multiple visual styles' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scale Game Builder</h1>
          <p className="text-lg text-gray-600">Create and publish your game in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Step 1: Name Your Game */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Give your game a catchy name that players will remember
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Enter your game name..."
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    className="text-center text-lg h-12 focus:ring-2 focus:ring-blue-500 border-2"
                  />
                  {gameName && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Great! Your game will be called: <span className="font-semibold">"{gameName}"</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Choose Template */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Select a template to get started quickly
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md mb-3 flex items-center justify-center">
                          <Gamepad2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected: <span className="font-semibold">
                        {templates.find(t => t.id === selectedTemplate)?.name}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Customize */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Customize your game to make it unique
                  </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-8">
                  
                  {/* Theme Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Choose Theme</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {themes.map((theme) => (
                        <Card
                          key={theme.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            customizations.theme === theme.id
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setCustomizations(prev => ({ ...prev, theme: theme.id }))}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-full h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md mb-2 flex items-center justify-center">
                              <Settings className="w-6 h-6 text-gray-600" />
                            </div>
                            <h4 className="font-medium text-sm">{theme.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Color Scheme</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {colorSchemes.map((scheme) => (
                        <Card
                          key={scheme.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            customizations.colorScheme === scheme.id
                              ? 'ring-2 ring-blue-500'
                              : ''
                          }`}
                          onClick={() => setCustomizations(prev => ({ ...prev, colorScheme: scheme.id }))}
                        >
                          <CardContent className="p-3 text-center">
                            <div className={`w-full h-12 ${scheme.color} rounded-md mb-2`}></div>
                            <p className="text-xs font-medium">{scheme.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Difficulty Level</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <Card
                          key={level}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            customizations.difficulty === level
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setCustomizations(prev => ({ ...prev, difficulty: level }))}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              level === 'easy' ? 'bg-green-100' :
                              level === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <Star className={`w-4 h-4 ${
                                level === 'easy' ? 'text-green-600' :
                                level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                            </div>
                            <p className="font-medium capitalize">{level}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Game Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Game Features</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableFeatures.map((feature) => (
                        <Card
                          key={feature.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            customizations.features.includes(feature.id)
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{feature.name}</h4>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                customizations.features.includes(feature.id)
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {customizations.features.includes(feature.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Additional Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Volume2 className="w-5 h-5 text-blue-600" />
                              <div>
                                <h4 className="font-medium">Sound Effects</h4>
                                <p className="text-sm text-gray-600">Enable game sounds</p>
                              </div>
                            </div>
                            <Button
                              variant={customizations.soundEnabled ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCustomizations(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                            >
                              {customizations.soundEnabled ? 'On' : 'Off'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Zap className="w-5 h-5 text-blue-600" />
                              <div>
                                <h4 className="font-medium">Power-ups</h4>
                                <p className="text-sm text-gray-600">Special abilities</p>
                              </div>
                            </div>
                            <Button
                              variant={customizations.powerUps ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCustomizations(prev => ({ ...prev, powerUps: !prev.powerUps }))}
                            >
                              {customizations.powerUps ? 'On' : 'Off'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Customization Summary */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 text-center">Customization Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Theme:</span>
                          <span className="ml-2 font-medium capitalize">{customizations.theme}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <span className="ml-2 font-medium capitalize">{customizations.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Color:</span>
                          <span className="ml-2 font-medium">
                            {colorSchemes.find(c => c.id === customizations.colorScheme)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Features:</span>
                          <span className="ml-2 font-medium">{customizations.features.length} selected</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Publish */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Ready to publish your game?
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardHeader className="text-center">
                      <CardTitle className="text-green-800">Game Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Game Name:</p>
                        <p className="font-semibold text-lg">{gameName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Template:</p>
                        <p className="font-semibold">
                          {templates.find(t => t.id === selectedTemplate)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Theme:</p>
                        <p className="font-semibold capitalize">{customizations.theme}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Features:</p>
                        <p className="font-semibold">{customizations.features.length} selected</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Publishing Cost:</p>
                        <p className="font-semibold text-2xl text-green-600">$2.00</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handlePublish}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 text-lg"
                  >
                    Publish Game for $2
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}