import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { ActorSpec } from '@/api/client';

interface ActorSelectorProps {
  options: ActorSpec[];
  value: ActorSpec | null;
  onChange: (actor: ActorSpec) => void;
}

// Custom option template for the dropdown
const renderActorOption = (option: ActorSpec | null) => {
  return (
    <div className='flex items-center gap-2 py-2'>
      <Avatar
        image={undefined}
        label={option?.acronym ?? option?.name.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? '??'}
        size='normal'
        shape='circle'
      />
      <div className='flex flex-col'>
        <span className='font-medium'>{option?.name ?? ''}</span>
        <span className='text-xs text-gray-500'>{option?.description ?? ''}</span>
      </div>
    </div>
  );
};

// Selected value template for the dropdown
const renderActorValue = (option: ActorSpec) => {
  return renderActorOption(option);
};

export const ActorSelector: React.FC<ActorSelectorProps> = ({value, onChange: onActorChange, options}) => {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>In the style of:</label>
      <Dropdown
        disabled={options.length === 0}
        value={value}
        options={options}
        onChange={(e) => onActorChange(e.value)}
        itemTemplate={renderActorOption}
        valueTemplate={renderActorValue}
        useOptionAsValue
        placeholder=''
        className='w-full'
      />
    </div>
  );
};
