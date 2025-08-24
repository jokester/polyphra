import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({value, onChange, readOnly = false}) => {
  return (
    <div className='space-y-2'>
      <label htmlFor='user-input' className='text-sm font-medium'>
        Selected text:
      </label>
      <InputTextarea
        id='user-input'
        placeholder="Type your text here... For example: 'I am very happy today because the weather is nice.'"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className='w-full resize-none'
      />
    </div>
  );
};
