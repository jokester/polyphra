import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface TextInputProps {
  value: string;
  label: string
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, readOnly = false }) => {
  return (
    <div className='space-y-2'>
      <label htmlFor='user-input' className='text-sm font-medium'>
        {label}
      </label>
      <InputTextarea
        id='user-input'
        placeholder="Type some text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className='w-full resize-none'
      />
    </div>
  );
};
