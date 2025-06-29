import React from 'react';
import { Card } from 'primereact/card';

export const InstructionsCard: React.FC = () => {
  return (
    <Card className='bg-amber-50 border-amber-200'>
      <div className='p-4'>
        <h4 className='font-medium text-amber-800 mb-2'>How to use:</h4>
        <ol className='text-sm text-amber-700 space-y-1 list-decimal list-inside'>
          <li>Select an actor/character from the dropdown</li>
          <li>Type or paste your text in the input area</li>
          <li>Click "Rephrase Text" to see it in the actor's style</li>
          <li>Use the "Listen" button to hear the rephrased text</li>
        </ol>
      </div>
    </Card>
  );
};
