'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Volume2, Wand2 } from 'lucide-react';
import React from 'react';

// Sample actors with their characteristics
const actors = [
  {
    id: 'shakespeare',
    name: 'William Shakespeare',
    description: 'Elizabethan poet and playwright',
    style: 'Eloquent, poetic, uses thee/thou, metaphorical',
    avatar: '/placeholder.svg?height=40&width=40',
    accent: 'British',
    specialty: 'Classical Literature',
  },
  {
    id: 'sherlock',
    name: 'Sherlock Holmes',
    description: 'Brilliant detective',
    style: 'Analytical, precise, deductive reasoning',
    avatar: '/placeholder.svg?height=40&width=40',
    accent: 'British',
    specialty: 'Logic & Deduction',
  },
  {
    id: 'yoda',
    name: 'Master Yoda',
    description: 'Wise Jedi Master',
    style: 'Inverted sentence structure, philosophical',
    avatar: '/placeholder.svg?height=40&width=40',
    accent: 'Unique',
    specialty: 'Wisdom & Philosophy',
  },
  {
    id: 'gatsby',
    name: 'Jay Gatsby',
    description: 'Romantic dreamer from the Jazz Age',
    style: 'Romantic, optimistic, 1920s slang',
    avatar: '/placeholder.svg?height=40&width=40',
    accent: 'American',
    specialty: 'Romance & Dreams',
  },
  {
    id: 'churchill',
    name: 'Winston Churchill',
    description: 'British Prime Minister and orator',
    style: 'Commanding, inspirational, formal',
    avatar: '/placeholder.svg?height=40&width=40',
    accent: 'British',
    specialty: 'Leadership & Oratory',
  },
];

export function Modal() {
  const [selectedActor, setSelectedActor] = useState<string>('');
  const [userText, setUserText] = useState<string>('');
  const [rephrasedText, setRephrasedText] = useState<string>('');
  const [isRephrasing, setIsRephrasing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const selectedActorData = actors.find((actor) => actor.id === selectedActor);

  // Mock rephrase function - in real app, this would call your AI service
  const handleRephrase = async () => {
    if (!userText.trim() || !selectedActor) return;

    setIsRephrasing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock rephrased responses based on actor
    const mockResponses: Record<string, string> = {
      shakespeare: `Hark! ${
        userText.toLowerCase().replace(/you/g, 'thou').replace(/your/g, 'thy')
      }. Verily, 'tis a most wondrous sentiment that doth stir the very essence of one's soul!`,
      sherlock:
        `Elementary observation: "${userText}" - a statement that, upon careful analysis, reveals the logical conclusion that the speaker possesses a methodical approach to communication.`,
      yoda: `"${userText}", you say. Hmm. Wise words these are, yes. Much to learn from this, there is.`,
      gatsby:
        `Old sport, "${userText}" - why, that's simply marvelous! It reminds me of those golden summer evenings when hope danced like fireflies across the bay.`,
      churchill:
        `"${userText}" - Indeed, this statement embodies the very spirit of determination that shall guide us through our darkest hours toward the dawn of victory!`,
    };

    setRephrasedText(mockResponses[selectedActor] || userText);
    setIsRephrasing(false);
  };

  // Text-to-speech function
  const handleSpeak = () => {
    if (!rephrasedText.trim()) return;

    setIsSpeaking(true);

    // Use Web Speech API
    const utterance = new SpeechSynthesisUtterance(rephrasedText);

    // Try to set voice based on actor's accent
    const voices = speechSynthesis.getVoices();
    if (selectedActorData?.accent === 'British') {
      const britishVoice = voices.find((voice) => voice.lang.includes('en-GB') || voice.name.includes('British'));
      if (britishVoice) utterance.voice = britishVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center'>
      <Card className='w-full max-w-4xl mx-auto shadow-2xl'>
        <CardHeader className='text-center space-y-4'>
          <CardTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            English Learning Studio
          </CardTitle>
          <CardDescription className='text-lg'>
            Learn English by rephrasing your text in the style of famous characters and historical figures
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Actor Selection */}
          <div className='space-y-3'>
            <label className='text-sm font-medium'>Choose Your English Tutor</label>
            <Select value={selectedActor} onValueChange={setSelectedActor}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select an actor to guide your learning...' />
              </SelectTrigger>
              <SelectContent>
                {actors.map((actor) => (
                  <SelectItem key={actor.id} value={actor.id}>
                    <div className='flex items-center gap-3 py-2'>
                      <Avatar className='w-8 h-8'>
                        <AvatarImage src={actor.avatar || '/placeholder.svg'} alt={actor.name} />
                        <AvatarFallback>
                          {actor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{actor.name}</span>
                        <span className='text-xs text-muted-foreground'>{actor.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Actor Info */}
          {selectedActorData && (
            <Card className='bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
              <CardContent className='pt-4'>
                <div className='flex items-start gap-4'>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage src={selectedActorData.avatar || '/placeholder.svg'} alt={selectedActorData.name} />
                    <AvatarFallback>
                      {selectedActorData.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold'>{selectedActorData.name}</h3>
                      <Badge variant='secondary'>{selectedActorData.accent}</Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>{selectedActorData.style}</p>
                    <Badge variant='outline' className='text-xs'>
                      {selectedActorData.specialty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Section */}
          <div className='space-y-3'>
            <label htmlFor='user-input' className='text-sm font-medium'>
              Your Text (Enter a sentence or paragraph to rephrase)
            </label>
            <Textarea
              id='user-input'
              placeholder="Type your text here... For example: 'I am very happy today because the weather is nice.'"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className='min-h-[120px] resize-none'
            />
          </div>

          {/* Rephrase Button */}
          <Button
            onClick={handleRephrase}
            disabled={!userText.trim() || !selectedActor || isRephrasing}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            size='lg'
          >
            {isRephrasing
              ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Rephrasing in {selectedActorData?.name}'s style...
                </>
              )
              : (
                <>
                  <Wand2 className='w-4 h-4 mr-2' />
                  Rephrase Text
                </>
              )}
          </Button>

          {/* Output Section */}
          {rephrasedText && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium'>Rephrased by {selectedActorData?.name}</label>
                <Button onClick={handleSpeak} disabled={isSpeaking} variant='outline' size='sm'>
                  {isSpeaking
                    ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Speaking...
                      </>
                    )
                    : (
                      <>
                        <Volume2 className='w-4 h-4 mr-2' />
                        Listen
                      </>
                    )}
                </Button>
              </div>
              <Card className='bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'>
                <CardContent className='pt-4'>
                  <p className='text-sm leading-relaxed italic'>"{rephrasedText}"</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions */}
          <Card className='bg-amber-50 border-amber-200'>
            <CardContent className='pt-4'>
              <h4 className='font-medium text-amber-800 mb-2'>How to use:</h4>
              <ol className='text-sm text-amber-700 space-y-1 list-decimal list-inside'>
                <li>Select an actor/character from the dropdown</li>
                <li>Type or paste your text in the input area</li>
                <li>Click "Rephrase Text" to see it in the actor's style</li>
                <li>Use the "Listen" button to hear the rephrased text</li>
              </ol>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
